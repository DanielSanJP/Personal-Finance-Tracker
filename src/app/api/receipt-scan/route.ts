import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCategoryFromBusiness } from '@/constants/business-mapping';
import { getCategoryName, EXPENSE_CATEGORIES } from '@/constants/categories';

// Validate environment variables at startup
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GEMINI_API_KEY environment variable is not set!');
}

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Constants for validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/heic'
];

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Gemini API key is not configured. Please contact support.'
        },
        { status: 500 }
      );
    }

    // Get image data from request
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(imageFile.type.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Invalid image format',
          details: `Supported formats: ${ALLOWED_MIME_TYPES.join(', ')}`,
          receivedType: imageFile.type
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'Image file too large',
          details: `Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          receivedSize: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`
        },
        { status: 400 }
      );
    }

    // Convert image file to base64
    const imageBytes = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = imageBytes.toString('base64');

    console.log('Received image type:', imageFile.type);
    console.log('Image size:', imageBytes.length, 'bytes');

    // Get available categories for prompt
    const categoryOptions = EXPENSE_CATEGORIES.map(cat => cat.name).join(', ');

    // Create the prompt for Gemini to analyze the receipt
    const prompt = `
    Analyze this receipt image and extract the following information in JSON format. Be very accurate and look for the most likely total amount (not individual items, taxes, or discounts):

    {
      "merchant": "business name (clean, no extra numbers or text)",
      "amount": "final total amount as decimal number (e.g., 25.50)",
      "date": "date in YYYY-MM-DD format if found",
      "time": "time in HH:MM format if found on receipt (24-hour format)",
      "items": ["list of main purchased items if clearly visible"],
      "category": "best matching category from: ${categoryOptions}"
    }

    Important rules:
    - For amount: Look for "Total", "Amount Due", "Balance", or final payment amount
    - Ignore individual item prices, taxes, discounts, change amounts, or "why pay" comparison prices
    - If multiple amounts, choose the one most likely to be the final total the customer paid
    - For merchant: Use the main business name, clean up any store numbers or extra text
    - For date: Use the transaction date, not printed date
    - For time: Extract the transaction time if visible on receipt (look for time stamps near date/total)
    - For category: Choose the most appropriate category based on the merchant and items. Use ONLY the exact category names from the list above.

    IMPORTANT SYSTEM CONTEXT:
    - Our app uses a universal party system: transactions have "from_party" (source) and "to_party" (destination)
    - For expenses: from_party = account name, to_party = merchant name
    - Date field stores full timestamp including time (YYYY-MM-DDTHH:MM:SS format)
    - If time is found, it will be combined with the date; if not, current time will be used

    Return only valid JSON, no additional text.
    `;

    // Prepare the image data for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    };

    // Call Gemini to analyze the receipt with comprehensive error handling
    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;

    // Check for safety blocks
    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
      console.error('⚠️ Content blocked by safety filters');
      return NextResponse.json(
        { 
          error: 'Image blocked by safety filters',
          details: 'The image was flagged by content safety filters. Please try a different image.'
        },
        { status: 400 }
      );
    }

    // Check for other finish reasons
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
      console.error('⚠️ Unexpected finish reason:', finishReason);
      return NextResponse.json(
        { 
          error: 'Receipt processing incomplete',
          details: `API stopped with reason: ${finishReason}. Please try again.`
        },
        { status: 500 }
      );
    }

    const text = response.text();

    // Check for empty response
    if (!text || text.trim().length === 0) {
      console.error('❌ Empty response from Gemini');
      return NextResponse.json(
        { 
          error: 'No text extracted from image',
          details: 'The image may be too blurry, dark, or unreadable. Please try a clearer image.'
        },
        { status: 400 }
      );
    }

    console.log('=== GEMINI RESPONSE ===');
    console.log(text);
    console.log('=== END GEMINI RESPONSE ===');

    // Parse the JSON response from Gemini
    let parsedData;
    try {
      // Clean the response text to extract JSON
      const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      
      // Fallback: try to extract basic info from text if JSON parsing fails
      parsedData = {
        merchant: '',
        amount: '',
        date: null,
        items: [],
        category: 'other'
      };
    }

    // Validate and clean the parsed data
    // Combine date and time if both are available
    let dateValue = null;
    if (parsedData.date) {
      const dateStr = parsedData.date;
      const timeStr = parsedData.time || new Date().toTimeString().split(' ')[0].substring(0, 5); // Use current time if not found
      dateValue = new Date(`${dateStr}T${timeStr}`);
    }

    const result_data = {
      merchant: parsedData.merchant || '',
      amount: parsedData.amount ? String(parsedData.amount) : '',
      date: dateValue,
      items: Array.isArray(parsedData.items) ? parsedData.items : [],
      category: parsedData.category || 'other'
    };

    // Smart category detection using shared business mapping if Gemini didn't provide a good category
    const searchText = `${result_data.merchant} ${result_data.items.join(' ')}`.toLowerCase();
    const detectedCategoryId = getCategoryFromBusiness(searchText);
    
    if (detectedCategoryId) {
      result_data.category = getCategoryName(detectedCategoryId, 'expense');
    }

    console.log('=== FINAL RESULT ===');
    console.log(JSON.stringify(result_data, null, 2));

    // Return the extracted and parsed data
    return NextResponse.json({
      extractedText: text,
      parsedData: result_data,
      confidence: 0.9, // Gemini generally provides high confidence results
    });

  } catch (error) {
    console.error('❌ Receipt scanning error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'UnknownError',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Provide helpful error messages based on error type
    let errorMessage = 'Receipt scanning failed';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';
    const hints: string[] = [];

    if (error instanceof Error) {
      // Model not found error
      if (error.message.includes('is not found for API version') || error.message.includes('404') && error.message.includes('model')) {
        errorMessage = 'API model error';
        errorDetails = 'The AI model is not available or has been updated';
        hints.push('The model name may have changed', 'Check Gemini API documentation for available models');
      }
      // API quota exceeded
      else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = 'API quota exceeded';
        errorDetails = 'Daily API limit reached. Please try again tomorrow.';
        hints.push('Consider upgrading your Gemini API plan');
      }
      // Authentication errors
      else if (error.message.includes('API key') || error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'API authentication failed';
        errorDetails = 'Invalid or expired API key';
        hints.push('Check your GEMINI_API_KEY environment variable');
      }
      // Network errors
      else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error';
        errorDetails = 'Failed to connect to Gemini API';
        hints.push('Check your internet connection', 'Verify Gemini API is accessible');
      }
      // Rate limiting
      else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded';
        errorDetails = 'Too many requests. Please wait a moment and try again.';
        hints.push('Wait 60 seconds before retrying');
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        hints: hints.length > 0 ? hints : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}


