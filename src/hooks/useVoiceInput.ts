"use client";
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionError extends Event {
    readonly error: 'no-speech' | 'audio-capture' | 'not-allowed' | 'network' | string;
  }
  
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
  
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

export interface VoiceInputResult {
  amount: string;
  description: string;
  category: string;
  merchant: string;
  account: string;
  date: string;
  originalTranscript: string;
  confidence: number;
}

interface UseVoiceInputProps {
  onResult: (result: VoiceInputResult) => void;
  accounts?: { name: string; type: string; id: string }[];
  transactionType?: 'expense' | 'income';
}

export const useVoiceInput = ({
  onResult,
  accounts = [],
  transactionType = 'expense'
}: UseVoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [parsedData, setParsedData] = useState<Partial<VoiceInputResult> | null>(null);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Browser compatibility check for Web Speech API
  const checkBrowserSupport = useCallback(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { supported: false, reason: 'Not in browser environment' };
    }

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      return { supported: false, reason: 'HTTPS required for microphone access' };
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return { supported: false, reason: 'Browser does not support speech recognition' };
    }

    return { supported: true, reason: '' };
  }, []);

  // Process transcript through API and extract transaction details
  const processTranscript = useCallback(async (rawTranscript: string, fromRecording = false) => {
    if (!rawTranscript.trim() || isProcessing) return;

    // Transition states together - React will batch these updates
    if (fromRecording) {
      setIsRecording(false);
      setIsProcessing(true);
    } else {
      setIsProcessing(true);
    }
    
    setError(null);
    setLastTranscript(rawTranscript);

    try {
      // Send to Gemini API for comprehensive processing
      const formData = new FormData();
      formData.append('transcript', rawTranscript);
      formData.append('accounts', JSON.stringify(accounts));
      formData.append('type', transactionType);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process voice input');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Map API results to VoiceInputResult
      const result: VoiceInputResult = {
        amount: data.parsedDetails?.amount || '',
        description: data.parsedDetails?.description || '',
        category: data.parsedDetails?.category || '',
        merchant: data.parsedDetails?.merchant || '',
        account: data.parsedDetails?.account || '',
        date: data.parsedDetails?.date || new Date().toISOString().split('T')[0],
        originalTranscript: data.originalTranscript || rawTranscript,
        confidence: data.confidence || 0.8
      };

      console.log('Processed voice input result:', result);
      
      // Update local state for the modal
      setParsedData(result);
      setConfidence(result.confidence);
      
      // Call parent callback with results
      onResult(result);

      toast.success('Voice input processed!', {
        description: 'Please review the auto-filled fields.',
      });

    } catch (err) {
      console.error('Voice processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Voice processing failed';
      setError(errorMessage);
      
      toast.error('Speech processing failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onResult, accounts, transactionType, isProcessing]);

  // Start speech recognition
  const startVoiceInput = useCallback(async () => {
    try {
      // Check browser support first
      const support = checkBrowserSupport();
      if (!support.supported) {
        throw new Error(support.reason);
      }

      setError(null);

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition settings
      recognition.continuous = false; // Stop after one result
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // Set up event handlers
      recognition.onstart = () => {
        setIsRecording(true);
        console.log('Speech recognition started');
        toast.info('Listening...', {
          description: 'Speak now to fill the form. Click stop when finished.',
        });
      };

      recognition.onresult = (event) => {
        const result = event.results[0];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          console.log('Raw transcript:', transcript);
          
          // Immediately transition from recording to processing in the same state update
          // This prevents any UI flicker
          processTranscript(transcript, true);
        }
      };

      recognition.onerror = (event) => {
        const errorEvent = event as unknown as SpeechRecognitionError;
        console.error('Speech recognition error:', errorEvent.error);
        setIsRecording(false);
        
        let errorMessage = 'Speech recognition failed';
        switch (errorEvent.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not available. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${errorEvent.error}`;
        }
        
        toast.error('Speech recognition failed', {
          description: errorMessage,
        });
        
        setError(errorMessage);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log('Speech recognition ended');
      };

      // Store reference and start recognition
      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error('Failed to start speech recognition', {
        description: errorMessage,
      });
      
      setError(errorMessage);
      setIsRecording(false);
    }
  }, [checkBrowserSupport, processTranscript]);

  // Stop speech recognition
  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
    }
  }, [isRecording]);

  // Reset voice input state
  const resetVoiceInput = useCallback(() => {
    setError(null);
    setLastTranscript('');
    setParsedData(null);
    setConfidence(0);
  }, []);

  // Check if browser supports speech recognition
  const support = checkBrowserSupport();
  const isSupported = support.supported;

  return {
    isRecording,
    isProcessing,
    isSupported,
    error,
    lastTranscript,
    parsedData,
    confidence,
    startVoiceInput,
    stopVoiceInput,
    resetVoiceInput,
  };
};
