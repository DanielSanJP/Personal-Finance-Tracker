import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCategoryFromBusiness } from '@/constants/business-mapping';
import { getCategoryName } from '@/constants/categories';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
  try {
    // Get image data from request
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert image file to base64
    const imageBytes = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = imageBytes.toString('base64');

    console.log('Received image type:', imageFile.type);
    console.log('Image size:', imageBytes.length, 'bytes');

    // Create the prompt for Gemini to analyze the receipt
    const prompt = `
    Analyze this receipt image and extract the following information in JSON format. Be very accurate and look for the most likely total amount (not individual items, taxes, or discounts):

    {
      "merchant": "business name (clean, no extra numbers or text)",
      "amount": "final total amount as decimal number (e.g., 25.50)",
      "date": "date in YYYY-MM-DD format if found",
      "items": ["list of main purchased items if clearly visible"],
      "category": "best matching category from: food-dining, groceries, gas-fuel, shopping, entertainment, transport, health-medical, utilities, other"
    }

    Important rules:
    - For amount: Look for "Total", "Amount Due", "Balance", or final payment amount
    - Ignore individual item prices, taxes, discounts, change amounts, or "why pay" comparison prices
    - If multiple amounts, choose the one most likely to be the final total the customer paid
    - For merchant: Use the main business name, clean up any store numbers or extra text
    - For date: Use the transaction date, not printed date
    - For category: Choose the most appropriate category based on the merchant and items

    Return only valid JSON, no additional text.
    `;

    // Prepare the image data for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    };

    // Call Gemini to analyze the receipt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

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
    const result_data = {
      merchant: parsedData.merchant || '',
      amount: parsedData.amount ? String(parsedData.amount) : '',
      date: parsedData.date ? new Date(parsedData.date) : null,
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
    console.error('Receipt scanning error:', error);
    
    return NextResponse.json(
      { 
        error: 'Receipt scanning failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


