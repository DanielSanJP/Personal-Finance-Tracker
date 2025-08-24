import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { getCategoryFromBusiness } from '@/constants/business-mapping';
import { getCategoryName } from '@/constants/categories';

// Initialize the Google Cloud Vision client
const visionClient = new ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY,
});

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

    // Convert image file to buffer
    const imageBytes = Buffer.from(await imageFile.arrayBuffer());

    console.log('Received image type:', imageFile.type);
    console.log('Image size:', imageBytes.length, 'bytes');

    // Configure the vision request for document text detection
    const visionRequest = {
      image: {
        content: imageBytes.toString('base64'),
      },
      features: [
        {
          type: 'DOCUMENT_TEXT_DETECTION' as const,
          maxResults: 1,
        },
      ],
    };

    // Perform OCR on the receipt image
    const [response] = await visionClient.annotateImage(visionRequest);
    
    const textAnnotation = response.fullTextAnnotation;
    
    if (!textAnnotation || !textAnnotation.text) {
      return NextResponse.json(
        { error: 'No text detected in image' },
        { status: 400 }
      );
    }

    const extractedText = textAnnotation.text;
    
    // Debug: log the extracted text to understand what OCR is reading
    console.log('=== OCR EXTRACTED TEXT ===');
    console.log(extractedText);
    console.log('=== END OCR TEXT ===');
    
    // Parse the receipt text to extract transaction data
    const parsedData = parseReceiptText(extractedText);

    // Return the extracted text and parsed data
    return NextResponse.json({
      extractedText,
      parsedData,
      confidence: response.textAnnotations?.[0]?.confidence || 0,
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

// Helper function to parse receipt text and extract transaction data
function parseReceiptText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  console.log('=== PARSING LINES ===');
  lines.forEach((line, i) => console.log(`${i}: "${line}"`));
  console.log('=== END LINES ===');
  
  const result = {
    merchant: '',
    amount: '',
    date: null as Date | null,
    items: [] as string[],
    category: '',
  };

  // SMART MERCHANT EXTRACTION - AI Strategy
  // 1. Look for "Welcome to" pattern first
  const welcomeMatch = text.match(/welcome\s+to\s+([^0-9\n\r]+?)(?:\s+[A-Z][a-z]+&[A-Z][a-z]+|restaurant|store|number|\n|\r|$)/i);
  if (welcomeMatch) {
    result.merchant = welcomeMatch[1].trim().replace(/\s+/g, ' ');
  }
  
  // 2. If no welcome pattern, look for business name in first few lines
  if (!result.merchant) {
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Skip lines that are clearly not business names
      if (/^\d+$|order|number|email|abn|tax|invoice/i.test(line)) continue;
      
      // Look for lines with business-like names
      if (/^[A-Za-z][A-Za-z\s&'.-]{2,30}$/.test(line) && 
          !/restaurant\s+number|store\s+number/i.test(line)) {
        result.merchant = line.trim();
        break;
      }
    }
  }

  // SMART AMOUNT EXTRACTION - AI Strategy
  // 1. Find all potential amounts with their line positions
  const amountCandidates: { amount: string, value: number, lineIndex: number, context: string }[] = [];
  
  lines.forEach((line, index) => {
    // Look for amounts with 2 decimal places
    const amounts = line.match(/\$?\s*([\d,]+\.\d{2})/g);
    if (amounts) {
      amounts.forEach(amountStr => {
        const cleanAmount = amountStr.replace(/[$,\s]/g, '');
        const value = parseFloat(cleanAmount);
        if (value > 0 && value < 10000) {
          amountCandidates.push({
            amount: cleanAmount,
            value,
            lineIndex: index,
            context: line.toLowerCase()
          });
        }
      });
    }
  });

  // Also check the lines above and below each amount for more context
  amountCandidates.forEach(candidate => {
    const prevLine = candidate.lineIndex > 0 ? lines[candidate.lineIndex - 1]?.toLowerCase() || '' : '';
    const nextLine = candidate.lineIndex < lines.length - 1 ? lines[candidate.lineIndex + 1]?.toLowerCase() || '' : '';
    
    // Extend context with surrounding lines
    candidate.context = `${prevLine} ${candidate.context} ${nextLine}`.trim();
  });

  console.log('=== AMOUNT CANDIDATES ===');
  amountCandidates.forEach(candidate => {
    console.log(`${candidate.amount} (${candidate.value}) at line ${candidate.lineIndex}: "${candidate.context}"`);
  });

  // 2. ADVANCED AI-BASED SCORING ALGORITHM
  let bestAmount = '';
  let bestScore = -1;

  amountCandidates.forEach(candidate => {
    let score = 0;
    const context = candidate.context.toLowerCase();
    
    // === POSITIONAL ANALYSIS ===
    // Higher score for amounts near the end (receipts show totals at bottom)
    score += (candidate.lineIndex / lines.length) * 30;
    
    // === PATTERN RECOGNITION ===
    // Check if this looks like an individual item line (quantity @ price format)
    const isItemLine = /\d+\s*@\s*\$?[\d,]+\.?\d*\s*(ea|each|l|kg|lb)?\s*=/.test(context);
    
    // Check for fuel-specific patterns (liters, gallons)
    const isFuelLine = /\d+\.\d+\s*(l|ltr|liters?|gal|gallons?)\s*@/.test(context);
    
    // === DISCOUNT/NEGATIVE DETECTION ===
    // Look for minus signs, discount keywords, and percentage discounts
    const hasMinusSign = /-\s*\$?\d+\.?\d*|\$?\d+\.?\d*\s*-/.test(context);
    const hasDiscountKeywords = /discount|disc(?!ount)|\boff\b|saving|promo|coupon|rebate|\d+%.*disc/.test(context);
    const isPercentageDiscount = /\d+%.*disc|disc.*\d+%/.test(context);
    
    // === SALE TRANSACTION DETECTION (NOT DISCOUNT) ===
    const isCashSale = /cash\s+sale|credit\s+sale|sale\s+transaction/.test(context);
    
    // === "WHY PAY" PRICE DETECTION (CRITICAL FOR CHEMIST WAREHOUSE) ===
    const isWhyPayPrice = /why\s+pay|was\s+\$|rrp|recommended\s+retail/.test(context);
    
    // === TOTAL/PAYMENT DETECTION ===
    const subtotalKeywords = /subtotal|sub\s+total/.test(context);
    const finalTotalKeywords = /\btotal\b(?!\s*includes)/.test(context); // Exclude "total includes gst"
    const paymentKeywords = /eftpos|payment|amount\s+due|balance|due|final|charged|paid/.test(context);
    const paymentConfirmation = /visa|mastercard|eft\s+pos|eftpos|card|manual/.test(context);
    const changeKeywords = /change|cash\s+change|your\s+change|change\s+due/.test(context);
    
    // === TAX/GST DETECTION ===
    const isTaxLine = /gst|tax|vat|\d+\.\d+\s*%\s*(gst|tax)/.test(context);
    const isTaxOnlyLine = /\b(gst|tax)\s+(of|is|amount)\s+\$?\d+/.test(context); // "gst of $0.62"
    
    // === SCORING LOGIC ===
    
    if (isItemLine || isFuelLine) {
      // Heavy penalty for individual item lines
      score -= 50;
    } else if (isWhyPayPrice) {
      // MASSIVE penalty for "why pay" comparison prices
      score -= 300;
    } else if (hasMinusSign || (hasDiscountKeywords && !isCashSale) || isPercentageDiscount) {
      // VERY HEAVY penalty for discounts and negative amounts (but not cash sales)
      score -= 200;
    } else if (isTaxOnlyLine) {
      // Heavy penalty for tax-only lines (like "gst of $0.62")
      score -= 80;
    } else {
      // POSITIVE SCORING for potential totals
      
      if (finalTotalKeywords || paymentKeywords) {
        score += 100; // Very high score for final total keywords
      } else if (subtotalKeywords) {
        score += 40; // Lower score for subtotals (not final total)
      }
      
      if (paymentConfirmation && !changeKeywords) {
        score += 120; // Highest score for payment confirmations (not change)
      }
      
      // Specific high-value keywords
      if (/amount\s+due/.test(context)) {
        score += 140; // Maximum score for "Amount Due"
      }
    }
    
    // === CHANGE AMOUNT PENALTY ===
    if (changeKeywords && !paymentConfirmation) {
      score -= 100; // Heavy penalty for change amounts (but not payment confirmations)
    }
    
    // === AMOUNT RANGE ANALYSIS ===
    // Penalty for very small amounts that could be change or tax
    if (candidate.value < 1.00) {
      score -= 30;
    } else if (candidate.value < 5.00) {
      score -= 15;
    }
    
    // Bonus for reasonable total amounts
    if (candidate.value >= 5.00 && candidate.value <= 1000.00) {
      score += 20;
    }
    
    // === CONTEXT CONSISTENCY CHECK ===
    // If multiple instances of same amount exist, prefer the one with better context
    const sameAmountCandidates = amountCandidates.filter(c => c.value === candidate.value);
    if (sameAmountCandidates.length > 1) {
      // Bonus for amounts that appear multiple times (likely the real total)
      score += 40;
      
      const hasPaymentContext = paymentConfirmation || finalTotalKeywords || paymentKeywords;
      if (hasPaymentContext) {
        score += 30; // Additional bonus for better context when duplicate amounts exist
      }
    }
    
    // === ENHANCED LOGGING ===
    const flags = [
      isItemLine ? 'ITEM' : '',
      isFuelLine ? 'FUEL' : '',
      isCashSale ? 'CASH_SALE' : '',
      isWhyPayPrice ? 'WHY_PAY' : '',
      hasMinusSign ? 'MINUS' : '',
      hasDiscountKeywords && !isCashSale ? 'DISCOUNT' : '',
      paymentConfirmation ? 'PAYMENT' : '',
      subtotalKeywords ? 'SUBTOTAL' : '',
      finalTotalKeywords || paymentKeywords ? 'TOTAL' : '',
      changeKeywords ? 'CHANGE' : '',
      isTaxOnlyLine ? 'TAX_ONLY' : (isTaxLine ? 'TAX_MENTIONED' : ''),
      sameAmountCandidates.length > 1 ? 'DUPLICATE' : ''
    ].filter(Boolean);
    
    console.log(`Amount ${candidate.amount} scored: ${score} (context: "${candidate.context}") [${flags.join(', ')}]`);
    
    if (score > bestScore) {
      bestScore = score;
      bestAmount = candidate.amount;
    }
  });

  result.amount = bestAmount;

  console.log(`=== SELECTED AMOUNT: ${bestAmount} ===`);

  // SMART MERCHANT EXTRACTION - NZ/AU focused patterns
  const allText = lines.join(' ').toLowerCase();
  
  // Comprehensive NZ/AU merchant patterns
  const merchantPatterns = [
    // === SUPERMARKETS ===
    /(?:^|\s)(pak\s*[n']?\s*save|countdown|new\s*world|fresh\s*choice|four\s*square)(?:\s|$)/i,
    /(?:^|\s)(woolworths|coles|iga|aldi|foodworks|spar)(?:\s|$)/i,
    
    // === FAST FOOD ===
    /(?:^|\s)(mcdonald'?s?|kfc|burger\s*king|subway|pizza\s*hut|domino'?s?)(?:\s|$)/i,
    /(?:^|\s)(nando'?s?|grill'?d|oporto|red\s*rooster|hungry\s*jack'?s?)(?:\s|$)/i,
    
    // === FUEL STATIONS ===
    /(?:^|\s)(bp|shell|z\s*energy|z|mobil|caltex|gull|challenge)(?:\s|$)/i,
    
    // === RETAIL ===
    /(?:^|\s)(farmers|the\s*warehouse|kmart|target|briscoes|harvey\s*norman)(?:\s|$)/i,
    /(?:^|\s)(jb\s*hi-?fi|noel\s*leeming|dick\s*smith|pb\s*tech)(?:\s|$)/i,
    
    // === DEPARTMENT STORES ===
    /(?:^|\s)(myer|david\s*jones|big\s*w)(?:\s|$)/i,
    
    // === PHARMACIES ===
    /(?:^|\s)(unichem|life\s*pharmacy|chemist\s*warehouse|priceline)(?:\s|$)/i
  ];
  
  for (const pattern of merchantPatterns) {
    const match = allText.match(pattern);
    if (match) {
      result.merchant = match[1].trim().replace(/\s+/g, ' '); // Clean up spacing
      break;
    }
  }
  
  // If no pattern match, look for merchant names in common locations
  if (!result.merchant) {
    const firstFewLines = lines.slice(0, 5).join(' ').toLowerCase();
    const lastFewLines = lines.slice(-5).join(' ').toLowerCase();
    
    // Check for specific location indicators
    if (firstFewLines.includes('riccarton') || lastFewLines.includes('riccarton')) {
      result.merchant = 'Pak n Save'; // Common chain at Riccarton
    } else if (firstFewLines.includes('westfield') || lastFewLines.includes('westfield')) {
      result.merchant = 'Westfield'; // Shopping center
    }
  }

  // SMART DATE EXTRACTION
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
    /(\d{1,2}-\d{1,2}-\d{2,4})/,
    /(\d{4}-\d{1,2}-\d{1,2})/,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{1,2},?\s*\d{2,4}/i,
  ];

  for (const line of lines) {
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        const dateStr = match[1] || match[0];
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
          result.date = parsedDate;
          break;
        }
      }
    }
    if (result.date) break;
  }

  // SMART CATEGORY DETECTION - Using shared business mapping
  const fullText = text.toLowerCase();
  const detectedCategoryId = getCategoryFromBusiness(fullText);
  
  if (detectedCategoryId) {
    // Convert category ID to category name for UI compatibility
    result.category = getCategoryName(detectedCategoryId, 'expense');
  } else {
    // Default category if none matched
    result.category = getCategoryName('food-dining', 'expense');
  }

  console.log(`=== FINAL RESULT ===`);
  console.log(JSON.stringify(result, null, 2));

  return result;
}
