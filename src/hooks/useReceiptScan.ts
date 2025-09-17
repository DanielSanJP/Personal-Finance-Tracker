"use client";

import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface ReceiptData {
  merchant?: string;
  amount?: string;
  date?: Date;
  items?: string[];
  category?: string;
}

interface UseReceiptScanOptions {
  onReceiptData: (data: ReceiptData) => void;
  onError?: (error: string) => void;
}

export const useReceiptScan = ({ onReceiptData, onError }: UseReceiptScanOptions) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ReceiptData>({});
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processImage = useCallback(async (imageFile: File) => {
    try {
      setIsProcessing(true);

      // Create form data
      const formData = new FormData();
      formData.append('image', imageFile);

      // Send to API
      const response = await fetch('/api/receipt-scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Receipt scanning failed');
      }

      if (data.parsedData) {
        // Convert date string back to Date object if it exists
        const processedData = { ...data.parsedData };
        if (processedData.date && typeof processedData.date === 'string') {
          const parsedDate = new Date(processedData.date);
          processedData.date = !isNaN(parsedDate.getTime()) ? parsedDate : undefined;
        }
        
        setParsedData(processedData);
        setConfidence(data.confidence || 0);
        onReceiptData(processedData);
        toast.success('Receipt scanned successfully!', {
          description: 'Please review the auto-filled fields.',
        });
      } else {
        toast.error('No data extracted', {
          description: 'Please try with a clearer receipt image.',
        });
      }

    } catch (error) {
      console.error('Error processing receipt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error('Receipt scanning failed', {
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [onReceiptData, onError]);

  const checkBrowserSupport = useCallback(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return { supported: false, reason: 'Not in browser environment' };
    }

    // Check for File API support
    if (!window.File || !window.FileReader) {
      return { supported: false, reason: 'Browser does not support file operations' };
    }

    return { supported: true, reason: '' };
  }, []);

  const scanFromFile = useCallback(async (file: File) => {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        throw new Error('Please select a valid image file (JPEG, PNG, HEIC, or WebP)');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Image file is too large. Please choose a file under 10MB.');
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Process the image
      await processImage(file);

    } catch (error) {
      console.error('Error scanning from file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast.error('Failed to scan receipt', {
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    }
  }, [processImage, onError]);

  const scanFromCamera = useCallback(async () => {
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera permission with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { 
            min: 640,
            ideal: 1280,
            max: 1920 
          },
          height: { 
            min: 480,
            ideal: 720,
            max: 1080 
          },
          frameRate: { 
            min: 15,
            ideal: 30,
            max: 30 
          },
          // Additional optimizations
          aspectRatio: { ideal: 16/9 }
        } 
      });

      // Create video element for preview with optimizations
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Pre-load video for faster capture
      await new Promise<void>((resolve, reject) => {
        video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        video.addEventListener('error', () => reject(new Error('Video failed to load')), { once: true });
        video.play();
      });

      // Return video element and stream for modal to handle
      return { video, stream };

    } catch (error) {
      console.error('Error accessing camera:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        toast.error('Camera access denied', {
          description: 'Please allow camera access to scan receipts.',
        });
      } else if (errorMessage.includes('not found') || errorMessage.includes('NotFoundError')) {
        toast.error('No camera found', {
          description: 'Please connect a camera or use file upload instead.',
        });
      } else {
        toast.error('Failed to access camera', {
          description: 'Please check your camera permissions and try again.',
        });
      }
      
      onError?.(errorMessage);
      throw error;
    }
  }, [onError]);

  const captureFromVideo = useCallback(async (video: HTMLVideoElement): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Use requestAnimationFrame to ensure we capture the latest frame
      requestAnimationFrame(() => {
        try {
          // Ensure video is ready and playing
          if (video.readyState < 2) {
            reject(new Error('Video not ready for capture'));
            return;
          }

          // Create canvas and capture frame (optimized)
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { 
            alpha: false, // Disable alpha channel for better performance
            willReadFrequently: false // Optimize for single capture
          });
          
          if (!context) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Set canvas size to video dimensions
          canvas.width = video.videoWidth || video.offsetWidth;
          canvas.height = video.videoHeight || video.offsetHeight;
          
          // Draw current frame immediately
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to blob with optimized settings
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to capture image'));
              return;
            }

            // Create file from blob
            const file = new File([blob], `receipt-${Date.now()}.jpg`, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(file);
          }, 'image/jpeg', 0.95); // Higher quality for better OCR

        } catch (error) {
          reject(error);
        }
      });
    });
  }, []);

  const openFileSelector = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  // Check if browser supports receipt scanning
  const support = checkBrowserSupport();
  const isSupported = support.supported;

  return {
    isProcessing,
    isSupported,
    previewUrl,
    parsedData,
    confidence,
    fileInputRef,
    scanFromFile,
    scanFromCamera,
    captureFromVideo,
    openFileSelector,
    clearPreview,
  };
};
