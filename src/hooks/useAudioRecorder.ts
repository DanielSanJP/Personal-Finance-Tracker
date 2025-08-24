import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAudioRecorderOptions {
  onTranscription: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const useAudioRecorder = ({ onTranscription, onError }: UseAudioRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Create form data
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      // Send to API
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Speech recognition failed');
      }

      if (data.transcript) {
        onTranscription(data.transcript);
        toast.success('Voice input processed!', {
          description: 'Please review the auto-filled fields.',
        });
      } else {
        toast.error('No speech detected', {
          description: 'Please try speaking more clearly.',
        });
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error('Speech processing failed', {
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscription, onError]);

  // Enhanced browser compatibility check
  const checkBrowserSupport = useCallback(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { supported: false, reason: 'Not in browser environment' };
    }

    // Check for HTTPS requirement (except localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      return { supported: false, reason: 'HTTPS required for microphone access on mobile devices' };
    }

    // Check for getUserMedia support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { supported: false, reason: 'Browser does not support audio recording' };
    }

    // Check for MediaRecorder support
    if (typeof MediaRecorder === 'undefined') {
      return { supported: false, reason: 'Browser does not support MediaRecorder' };
    }

    return { supported: true, reason: '' };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Check browser support first
      const support = checkBrowserSupport();
      if (!support.supported) {
        throw new Error(support.reason);
      }

      // Request microphone permission with mobile-friendly constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: { ideal: 48000, min: 16000, max: 48000 },
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true, // Helps with mobile audio
        } 
      });

      // Determine the best supported MIME type for this browser
      let mimeType = 'audio/webm;codecs=opus';
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/wav',
        'audio/ogg',
        'audio/mpeg'
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      // Create MediaRecorder with fallback options
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // Lower bitrate for mobile
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mimeType 
        });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Send to speech-to-text API
        await processAudio(audioBlob);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      toast.info('Listening...', {
        description: 'Speak now to fill the form. Tap again to stop.',
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        toast.error('Microphone access denied', {
          description: 'Please allow microphone access to use voice input.',
        });
      } else if (errorMessage.includes('HTTPS') || errorMessage.includes('secure')) {
        toast.error('Secure connection required', {
          description: 'Voice input requires HTTPS on mobile devices.',
        });
      } else if (errorMessage.includes('not support')) {
        toast.error('Browser not supported', {
          description: 'Please try Chrome, Safari, or Firefox.',
        });
      } else {
        toast.error('Failed to start recording', {
          description: 'Please check your microphone and try again.',
        });
      }
      
      onError?.(errorMessage);
    }
  }, [onError, processAudio, checkBrowserSupport]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Check if browser supports audio recording
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
