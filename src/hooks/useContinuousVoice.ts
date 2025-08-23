"use client";

import { useState, useCallback } from "react";
import { useAudioRecorder } from "./useAudioRecorder";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";

interface Account {
  id: string;
  name: string;
  type: string;
}

interface UseContinuousVoiceProps {
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
  
  // Extract amount (look for currency patterns)
  const amountPatterns = [
    /(\d+(?:\.\d{2})?)\s*dollars?/,
    /\$(\d+(?:\.\d{2})?)/,
    /(\d+(?:\.\d{2})?)\s*bucks?/,
    /(\d+(?:\.\d{2})?)(?:\s|$)/
  ];
  
  for (const pattern of amountPatterns) {
    const match = transcript.match(pattern);
    if (match) {
      result.amount = match[1];
      break;
    }
  }
  
  // Extract merchant/description - look for common patterns
  const merchantKeywords = [
    'at', 'from', 'to', 'for', 'on', 'in', 'with'
  ];
  
  // Find merchant after "at", "from", etc.
  for (const keyword of merchantKeywords) {
    const regex = new RegExp(`\\b${keyword}\\s+([\\w\\s&'-]+?)(?:\\s+(?:for|in|on|\\d)|$)`, 'i');
    const match = transcript.match(regex);
    if (match && match[1].trim().length > 1) {
      result.merchant = match[1].trim();
      console.log(`Extracted merchant: "${result.merchant}" using keyword: "${keyword}"`);
      
      // Extract the action part (what comes before the keyword)
      const beforeKeyword = transcript.split(new RegExp(`\\b${keyword}\\b`, 'i'))[0]
        .replace(/\$?\d+(?:\.\d{2})?\s*(?:dollars?|bucks?)?/gi, '') // Remove amount
        .trim();
      
      result.description = beforeKeyword || result.merchant;
      console.log(`Extracted description: "${result.description}"`);
      break;
    }
  }
  
  // If no merchant found, use the whole transcript (minus amount) as description
  if (!result.description) {
    result.description = transcript
      .replace(/\$?\d+(?:\.\d{2})?\s*(?:dollars?|bucks?)?/gi, '')
      .trim();
    console.log(`No merchant found, using full description: "${result.description}"`);
  }
  
  // Smart category detection based on merchant/description
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const searchText = `${result.description || ''} ${result.merchant || ''}`.toLowerCase();
  
  // Enhanced keyword mapping for better categorization
  const categoryKeywords = {
    'Food & Dining': [
      'coffee', 'starbucks', 'dunkin', 'cafe', 'restaurant', 'lunch', 'dinner', 
      'breakfast', 'food', 'eat', 'drink', 'pizza', 'burger', 'sushi', 'mcdonalds',
      'subway', 'chipotle', 'taco bell', 'kfc', 'grocery', 'supermarket', 'safeway',
      'whole foods', 'trader joes', 'costco food'
    ],
    'Transportation': [
      'gas', 'fuel', 'shell', 'exxon', 'bp', 'chevron', 'uber', 'lyft', 'taxi',
      'metro', 'bus', 'train', 'parking', 'toll', 'car wash', 'auto'
    ],
    'Shopping': [
      'amazon', 'target', 'walmart', 'costco', 'shopping', 'clothes', 'clothing',
      'shoes', 'electronics', 'best buy', 'apple store', 'mall'
    ],
    'Entertainment': [
      'netflix', 'spotify', 'movie', 'cinema', 'theater', 'game', 'gaming',
      'concert', 'music', 'streaming', 'youtube', 'disney'
    ],
    'Healthcare': [
      'doctor', 'hospital', 'pharmacy', 'cvs', 'walgreens', 'medical', 'dentist',
      'medicine', 'prescription', 'health'
    ],
    'Utilities': [
      'electric', 'electricity', 'water', 'internet', 'phone', 'cell', 'cable',
      'verizon', 'att', 'comcast', 'bill', 'utility'
    ],
    'Housing': [
      'rent', 'mortgage', 'home depot', 'lowes', 'apartment', 'house', 'housing'
    ]
  };
  
  // Find best category match
  for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      const category = categories.find(cat => 
        cat.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(cat.name.toLowerCase())
      );
      if (category) {
        result.category = category.name;
        break;
      }
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

export const useContinuousVoice = ({ 
  onFieldUpdate, 
  onComplete,
  accounts = [],
  type = 'expense'
}: UseContinuousVoiceProps) => {
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

  const { isRecording, isProcessing, startRecording, stopRecording } = useAudioRecorder({
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
    parsedData,
    confidence,
    startListening,
    stopListening,
  };
};
