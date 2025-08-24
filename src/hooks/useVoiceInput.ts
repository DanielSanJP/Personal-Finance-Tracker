"use client";

import { useState, useCallback } from "react";
import { useAudioRecorder } from "./useAudioRecorder";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { getCategoryFromBusiness } from "@/constants/business-mapping";

interface Account {
  id: string;
  name: string;
  type: string;
}

interface UseVoiceInputProps {
  onFieldUpdate: (field: string, value: string | Date) => void;
  onComplete?: () => void;
  accounts?: Account[];
  type?: 'expense' | 'income';
}

interface ParsedTransaction {
  amount?: string;
  description?: string;
  merchant?: string;
  category?: string;
  account?: string;
  date?: Date;
}

// Smart parsing function to extract all fields from continuous speech
const parseTransactionFromSpeech = (
  transcript: string, 
  accounts: Account[] = [], 
  type: 'expense' | 'income' = 'expense'
): ParsedTransaction => {
  const result: ParsedTransaction = {};
  const lowerTranscript = transcript.toLowerCase();
  
  // Helper function to parse amounts with word multipliers
  const parseAmountWithWords = (amountStr: string): string | null => {
    const cleanAmount = amountStr.toLowerCase().trim();
    
    // Handle written numbers with multipliers
    const wordPatterns = [
      // "2 thousand", "20 thousand", etc.
      /(\d+(?:\.\d+)?)\s*(?:k|thousand)/i,
      // "1 million", "2.5 million", etc.
      /(\d+(?:\.\d+)?)\s*(?:m|million)/i,
      // "1 billion" (just in case!)
      /(\d+(?:\.\d+)?)\s*(?:b|billion)/i,
      // Numbers with commas "500,000"
      /([\d,]+(?:\.\d+)?)/,
      // Regular numbers
      /(\d+(?:\.\d+)?)/
    ];

    for (const pattern of wordPatterns) {
      const match = cleanAmount.match(pattern);
      if (match) {
        let number = parseFloat(match[1].replace(/,/g, ''));
        
        if (pattern.source.includes('thousand|k')) {
          number *= 1000;
        } else if (pattern.source.includes('million|m')) {
          number *= 1000000;
        } else if (pattern.source.includes('billion|b')) {
          number *= 1000000000;
        }
        
        return number.toString();
      }
    }
    return null;
  };

  // Extract amount (look for currency patterns)
  const amountPatterns = [
    // Word-based amounts
    /(\d+(?:\.\d+)?\s*(?:thousand|k|million|m|billion|b))\s*dollars?/i,
    /\$(\d+(?:\.\d+)?\s*(?:thousand|k|million|m|billion|b))/i,
    /(\d+(?:\.\d+)?\s*(?:thousand|k|million|m|billion|b))\s*bucks?/i,
    
    // Numbers with commas
    /([\d,]+(?:\.\d+)?)\s*dollars?/i,
    /\$([\d,]+(?:\.\d+)?)/,
    /([\d,]+(?:\.\d+)?)\s*bucks?/i,
    
    // Regular patterns
    /(\d+(?:\.\d{2})?)\s*dollars?/i,
    /(\d+(?:\.\d{2})?)\s*bucks?/i,
    /(\d+(?:\.\d{2})?)\s*cents?/i, // Handle cents
    /(\d+)\s*and\s*(\d+)\s*cents?/i, // "5 and 50 cents"
    /(\d+)\s*(?:dollars?\s*and\s*)?(\d+)\s*cents?/i, // "5 dollars and 50 cents"
    
    // Fallback: any number (including with commas)
    /([\d,]+(?:\.\d{2})?)(?:\s|$)/
  ];

  for (const pattern of amountPatterns) {
    const match = transcript.match(pattern);
    if (match) {
      // Handle special cases like "5 and 50 cents" or "5 dollars and 50 cents"
      if (match[2]) {
        // Convert "dollars and cents" to decimal
        result.amount = `${match[1]}.${match[2].padStart(2, '0')}`;
      } else if (pattern.source.includes('cents')) {
        // Convert cents to dollars
        result.amount = (parseInt(match[1]) / 100).toFixed(2);
      } else {
        // Try to parse with word multipliers
        const parsedAmount = parseAmountWithWords(match[1]);
        result.amount = parsedAmount || match[1].replace(/,/g, '');
      }
      break;
    }
  }  // Extract merchant/description - look for common patterns
  const merchantKeywords = [
    'at', 'from', 'to', 'for', 'on', 'in', 'with', 'via', 'through', 'using'
  ];
  
  // Find merchant after "at", "from", etc.
  for (const keyword of merchantKeywords) {
    // Improved regex to better capture merchant names at the end of sentences
    const regex = new RegExp(`\\b${keyword}\\s+([\\w\\s&'-]+?)(?:\\s*(?:for|in|on|with|\\.|,|$)|$)`, 'i');
    const match = transcript.match(regex);
    if (match && match[1].trim().length > 1) {
      // Clean up the merchant name (remove trailing punctuation)
      result.merchant = match[1].trim().replace(/[.,!?;:]+$/, '');
      
      // Extract the action part (what comes before the keyword)
      const beforeKeyword = transcript.split(new RegExp(`\\b${keyword}\\b`, 'i'))[0]
        .replace(/\$?[\d,]+(?:\.\d+)?\s*(?:thousand|k|million|m|billion|b)?\s*(?:dollars?|bucks?|cents?)?/gi, '') // Remove amount with multipliers
        .trim()
        .replace(/[.,!?;:]+$/, ''); // Remove trailing punctuation
      
      result.description = beforeKeyword || result.merchant;
      break;
    }
  }
  
  // If no merchant found, try alternative patterns
  if (!result.merchant) {
    // Look for capitalized words (likely merchant names)
    const capitalizedWords = transcript.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
    if (capitalizedWords) {
      // Filter out common words that aren't merchants
      const commonWords = ['I', 'The', 'A', 'An', 'For', 'At', 'To', 'From', 'With', 'On', 'In'];
      const potentialMerchants = capitalizedWords.filter(word => 
        !commonWords.includes(word) && word.length > 2
      );
      if (potentialMerchants.length > 0) {
        result.merchant = potentialMerchants[potentialMerchants.length - 1]
          .replace(/[.,!?;:]+$/, ''); // Remove trailing punctuation
      }
    }
  }
  
  // If no merchant found, use the whole transcript (minus amount) as description
  if (!result.description) {
    result.description = transcript
      .replace(/\$?[\d,]+(?:\.\d+)?\s*(?:thousand|k|million|m|billion|b)?\s*(?:dollars?|bucks?|cents?)?/gi, '')
      .trim()
      .replace(/[.,!?;:]+$/, ''); // Remove trailing punctuation
  }
  
  // Smart category detection using shared business mapping
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const searchText = `${result.description || ''} ${result.merchant || ''}`.toLowerCase();
  
  // Try to get category from business mapping first
  const detectedCategoryId = getCategoryFromBusiness(searchText);
  
  if (detectedCategoryId) {
    // Find the matching category by ID
    const category = categories.find(cat => cat.id === detectedCategoryId);
    if (category) {
      result.category = category.name;
    }
  }
  
  // Smart account detection
  if (accounts.length > 0) {
    // Look for account name mentions
    const accountMatch = accounts.find(acc => 
      lowerTranscript.includes(acc.name.toLowerCase())
    );
    
    if (accountMatch) {
      result.account = accountMatch.id;
    } else {
      // Look for account type mentions
      const typeKeywords = ['checking', 'savings', 'credit', 'debit'];
      const foundType = typeKeywords.find(type => lowerTranscript.includes(type));
      
      if (foundType) {
        const typeMatch = accounts.find(acc => 
          acc.type.toLowerCase().includes(foundType)
        );
        if (typeMatch) {
          result.account = typeMatch.id;
        }
      } else {
        // Default to primary account (first one)
        result.account = accounts[0].id;
      }
    }
  }
  
  // Smart date detection
  if (lowerTranscript.includes('yesterday')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    result.date = yesterday;
  } else {
    // Default to today
    result.date = new Date();
  }
  
  return result;
};

export const useVoiceInput = ({ 
  onFieldUpdate, 
  onComplete,
  accounts = [],
  type = 'expense'
}: UseVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTransaction>({});
  const [confidence, setConfidence] = useState(0);

  const handleTranscription = useCallback((transcript: string) => {
    if (transcript.trim()) {
      console.log('Continuous transcript:', transcript);
      
      // Parse all fields from the transcript
      const parsed = parseTransactionFromSpeech(transcript, accounts, type);
      console.log('Parsed data:', parsed);
      
      setParsedData(parsed);
      
      // Calculate confidence based on how many fields we successfully parsed
      let confidenceScore = 0;
      if (parsed.amount) confidenceScore += 40; // Amount is most important
      if (parsed.description) confidenceScore += 25; // Description is second most important
      if (parsed.merchant) confidenceScore += 15; // Merchant adds good confidence
      if (parsed.category) confidenceScore += 15; // Category adds confidence
      if (parsed.account) confidenceScore += 5; // Account is often defaulted
      
      setConfidence(confidenceScore);
      
      // Auto-fill all parsed fields immediately
      Object.entries(parsed).forEach(([field, value]) => {
        if (value !== undefined && value !== '') {
          console.log(`Updating field ${field} with value:`, value);
          onFieldUpdate(field, value);
        }
      });
      
      // If we have good confidence (amount + description), auto-complete
      if (confidenceScore >= 70) {
        setTimeout(() => {
          setIsListening(false);
          onComplete?.();
        }, 1000);
      }
    }
  }, [accounts, type, onFieldUpdate, onComplete]);

  const { isRecording, isProcessing, isSupported, startRecording, stopRecording } = useAudioRecorder({
    onTranscription: handleTranscription,
  });

  const startListening = useCallback(() => {
    setIsListening(true);
    setParsedData({});
    setConfidence(0);
    startRecording();
  }, [startRecording]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  return {
    isListening,
    isRecording,
    isProcessing,
    isSupported,
    parsedData,
    confidence,
    startListening,
    stopListening,
  };
};
