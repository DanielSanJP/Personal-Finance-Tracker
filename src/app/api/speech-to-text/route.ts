import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/categories';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function POST(request: NextRequest) {
  try {
    // Get the transcript from request (pre-transcribed via Web Speech API)
    const formData = await request.formData();
    const rawTranscript = formData.get('transcript') as string;
    const accountsJson = formData.get('accounts') as string;
    const type = formData.get('type') as string || 'expense';
    
    if (!rawTranscript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    console.log('Raw transcript received:', rawTranscript);
    console.log('Transaction type:', type);

    // Parse accounts if provided
    let accounts = [];
    if (accountsJson) {
      try {
        accounts = JSON.parse(accountsJson);
      } catch (e) {
        console.log('Could not parse accounts:', e);
      }
    }

    // Get available categories for the specified type
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const categoryOptions = categories.map(cat => `${cat.name} (${cat.description})`).join('\n');
    
    // Create account options string
    const accountOptions = accounts.map((acc: {name: string, type: string}) => `${acc.name} (${acc.type})`).join('\n');

    // Let Gemini handle ALL the intelligence
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    const comprehensivePrompt = `
    You are an AI assistant that extracts financial transaction details from natural speech. 
    
    User said: "${rawTranscript}"
    Transaction type: ${type}
    Today's date: ${today}
    
    Available Categories:
    ${categoryOptions}
    
    ${accounts.length > 0 ? `Available Accounts:\n${accountOptions}` : ''}
    
    BUSINESS KNOWLEDGE (Critical for accurate categorization):
    - BP, Shell, Z Energy, Mobil, Caltex, Gull, Challenge = "Transportation" 
    - Petrol, diesel, gas, fuel = "Transportation"
    - McDonald's, KFC, Subway, Burger King, Pizza Hut, Domino's = "Food & Dining"
    - Starbucks, Costa, Robert Harris, coffee shops = "Food & Dining"
    - Countdown, Pak'n'Save, New World, Woolworths, Coles, ALDI = "Food & Dining"
    - Bunnings, Mitre 10, hardware stores = "Housing"
    - Chemist Warehouse, Unichem, Life Pharmacy = "Health & Fitness"
    - Gym, fitness centers, Anytime Fitness = "Health & Fitness"
    - Uber, taxi, parking, public transport = "Transportation"
    - Netflix, Spotify, Disney+, entertainment = "Entertainment"
    
    INSTRUCTIONS:
    1. Extract transaction details from natural speech - users can say anything naturally
    2. Handle common speech patterns like "I spent X on Y" or "X dollars for Y at Z"
    3. Parse amounts even if spoken as words ("fifty dollars" = 50.00)
    4. Identify merchants even if pronunciation is unclear
    5. Use business knowledge to categorize accurately
    6. Choose the best matching account if multiple available
    7. ALWAYS use today's date (${today}) unless user specifically mentions a different date like "yesterday" or "last week"
    8. CRITICAL: For "category", use ONLY the exact category names from the Available Categories list above. Do not create new category names.
    
    Return ONLY a JSON object in this exact format:
    {
      "amount": "decimal_number_only",
      "description": "clear_transaction_description", 
      "merchant": "business_name_if_mentioned",
      "category": "exact_category_name_from_Available_Categories_list",
      "account": "account_name_if_identifiable",
      "date": "YYYY-MM-DD",
      "confidence": confidence_score_0_to_100
    }
    
    Example responses:
    - "fifty dollars petrol at BP" → {"amount": "50.00", "description": "Petrol purchase", "merchant": "BP", "category": "Transportation", "account": "", "date": "${today}", "confidence": 95}
    - "lunch at McDonald's twenty five" → {"amount": "25.00", "description": "Lunch", "merchant": "McDonald's", "category": "Food & Dining", "account": "", "date": "${today}", "confidence": 90}
    `;

    // Call Gemini for comprehensive parsing
    const result = await model.generateContent(comprehensivePrompt);
    const response = await result.response;
    const geminiResponse = response.text().trim();

    console.log('Gemini comprehensive response:', geminiResponse);

    // Parse JSON response from Gemini
    let parsedData;
    try {
      // Clean the response to extract JSON
      const cleanedResponse = geminiResponse.replace(/```json\s*|\s*```/g, '').trim();
      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini JSON response:', parseError);
      console.log('Raw Gemini response:', geminiResponse);
      
      // Fallback parsing if JSON fails
      return NextResponse.json({
        transcript: rawTranscript,
        originalTranscript: rawTranscript,
        confidence: 0.5,
        error: 'Could not parse transaction details'
      });
    }

    // Validate and clean the parsed data
    const validatedData = {
      amount: parsedData.amount || '',
      description: parsedData.description || '',
      merchant: parsedData.merchant || '',
      category: parsedData.category || '',
      account: parsedData.account || '',
      date: parsedData.date || today, // Use the today variable from above
      confidence: Math.min(Math.max(parsedData.confidence || 80, 0), 100)
    };

    console.log('Final validated data:', validatedData);

    // Return the comprehensive parsing results
    return NextResponse.json({
      transcript: rawTranscript, // Keep original for display
      originalTranscript: rawTranscript,
      confidence: validatedData.confidence / 100, // Convert to 0-1 range
      parsedDetails: validatedData
    });

  } catch (error) {
    console.error('Speech processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Speech processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
