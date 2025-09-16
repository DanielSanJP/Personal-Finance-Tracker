"use client";
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// Add TypeScript declarations for Web Speech API and our custom properties
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    __geminiParsedDetails?: {
      amount?: string;
      description?: string;
      merchant?: string;
      category?: string;
    };
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
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
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
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
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

interface UseAudioRecorderOptions {
  onTranscription: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const useAudioRecorder = ({ onTranscription, onError }: UseAudioRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Enhanced browser compatibility check for Web Speech API
  const checkBrowserSupport = useCallback(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { supported: false, reason: 'Not in browser environment' };
    }

    // Check for HTTPS requirement (except localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      return { supported: false, reason: 'HTTPS required for microphone access' };
    }

    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return { supported: false, reason: 'Browser does not support speech recognition' };
    }

    return { supported: true, reason: '' };
  }, []);

  const enhanceTranscript = useCallback(async (rawTranscript: string) => {
    try {
      setIsProcessing(true);

      // Send the transcript to our Gemini-powered enhancement API
      const formData = new FormData();
      formData.append('transcript', rawTranscript);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance transcript');
      }

      if (data.transcript) {
        console.log('Enhanced transcript:', data.transcript);
        
        // Store the parsed details for the voice input hook to use
        if (data.parsedDetails) {
          window.__geminiParsedDetails = data.parsedDetails;
        }
        
        onTranscription(data.transcript);
        toast.success('Voice input processed!', {
          description: 'Please review the auto-filled fields.',
        });
      } else {
        throw new Error('No enhanced transcript received');
      }

    } catch (error) {
      console.error('Error enhancing transcript:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error('Speech processing failed', {
        description: errorMessage,
      });
      
      onError?.(errorMessage);
      
      // Fallback: use the raw transcript if enhancement fails
      onTranscription(rawTranscript);
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscription, onError]);

  const startRecording = useCallback(async () => {
    try {
      // Check browser support first
      const support = checkBrowserSupport();
      if (!support.supported) {
        throw new Error(support.reason);
      }

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

      recognition.onresult = async (event) => {
        const result = event.results[0];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          console.log('Raw transcript:', transcript);
          
          // Stop recording and enhance the transcript
          setIsRecording(false);
          await enhanceTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = 'Speech recognition failed';
        switch (event.error) {
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
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast.error('Speech recognition failed', {
          description: errorMessage,
        });
        
        onError?.(errorMessage);
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
      
      onError?.(errorMessage);
      setIsRecording(false);
    }
  }, [onError, enhanceTranscript, checkBrowserSupport]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Check if browser supports speech recognition
  const support = checkBrowserSupport();
  const isSupported = support.supported;

  return {
    isRecording,
    isProcessing,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};
