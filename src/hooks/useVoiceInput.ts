import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ParsedFormData {
  amount?: string;
  description?: string;
  incomeSource?: string;
  category?: string;
  account?: string;
  date?: Date;
}

interface VoiceInputConfig {
  onResult: (parsedData: ParsedFormData) => void;
  parseFunction: (transcript: string) => ParsedFormData;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useVoiceInput = ({ onResult, parseFunction }: VoiceInputConfig) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          console.log('Speech transcript:', transcript);
          
          const parsedData = parseFunction(transcript);
          onResult(parsedData);
          
          toast.success("Voice input processed!", {
            description: "Please review the auto-filled fields before saving.",
          });
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          toast.error("Voice input failed", {
            description: event.error === 'not-allowed' 
              ? "Please allow microphone access to use voice input."
              : "Please try again.",
          });
        };
        
        recognition.onend = () => setIsListening(false);
        
        setSpeechRecognition(recognition);
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    }
  }, [onResult, parseFunction]);

  const startListening = useCallback(() => {
    if (!speechRecognition || !isSupported) {
      toast.error("Voice input not supported", {
        description: "Your browser doesn't support voice input.",
      });
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      return;
    }

    try {
      speechRecognition.start();
      setIsListening(true);
      
      toast.info("Listening...", {
        description: "Speak now to fill the form. Example: 'Add 50 dollars salary to checking account'",
      });
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast.error("Failed to start voice input");
    }
  }, [speechRecognition, isSupported, isListening]);

  return {
    isListening,
    isSupported,
    startListening,
  };
};
