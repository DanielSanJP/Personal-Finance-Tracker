"use client";

import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ReceiptCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => Promise<void>;
  onStartCamera: () => Promise<{
    video: HTMLVideoElement;
    stream: MediaStream;
  }>;
  onCaptureFromVideo: (video: HTMLVideoElement) => Promise<File>;
  isProcessing?: boolean;
}

export const ReceiptCamera = ({
  isOpen,
  onClose,
  onCapture,
  onStartCamera,
  onCaptureFromVideo,
  isProcessing = false,
}: ReceiptCameraProps) => {
  const [videoStream, setVideoStream] = useState<{
    video: HTMLVideoElement;
    stream: MediaStream;
  } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Initialize camera when modal opens
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await onStartCamera();
        setVideoStream(stream);

        // Wait for video to be ready
        stream.video.addEventListener(
          "loadeddata",
          () => {
            setIsVideoReady(true);
          },
          { once: true }
        );
      } catch (error) {
        console.error("Failed to start camera:", error);
        onClose();
      }
    };

    const cleanup = () => {
      if (videoStream) {
        videoStream.stream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
      setIsCapturing(false);
      setIsVideoReady(false);
    };

    if (isOpen && !videoStream) {
      initializeCamera();
    }

    // Cleanup when modal closes
    if (!isOpen && videoStream) {
      cleanup();
    }

    // Cleanup on unmount
    return () => {
      if (videoStream) {
        videoStream.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, videoStream, onStartCamera, onClose]);

  const handleCapture = async () => {
    if (videoStream && !isCapturing && isVideoReady) {
      try {
        setIsCapturing(true);

        // Immediate capture without delay
        const file = await onCaptureFromVideo(videoStream.video);
        await onCapture(file);
        onClose();
      } catch (error) {
        console.error("Failed to capture image:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleClose = () => {
    if (videoStream) {
      videoStream.stream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setIsCapturing(false);
    onClose();
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[99999] bg-background flex flex-col"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        pointerEvents: "auto",
        touchAction: "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 shrink-0 border-b">
        <h2 className="text-lg sm:text-xl font-semibold">Camera</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-muted">
        {videoStream && (
          <video
            ref={(video) => {
              if (video && videoStream.video !== video) {
                video.srcObject = videoStream.stream;
                video.muted = true;
                video.playsInline = true;
                video.autoplay = true;
                video.play();
              }
            }}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        )}

        {/* Camera Frame Overlay for Desktop */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-4 inset-y-8 border-2 border-border rounded-lg">
            <div className="absolute top-4 left-4 right-4 text-center">
              <div className="bg-background backdrop-blur rounded px-3 py-1 inline-block border">
                <p className="text-sm text-foreground">
                  Position receipt within this frame
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 px-4 py-4 sm:px-6 sm:py-6 pb-6 sm:pb-8 bg-background border-t">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Button
            onClick={handleCapture}
            disabled={isProcessing || isCapturing || !isVideoReady}
            size="lg"
            className="rounded-full w-16 h-16 sm:w-20 sm:h-20 transition-all duration-150 active:scale-95"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              pointerEvents: "auto",
              zIndex: 100000,
            }}
          >
            <Camera className="size-6 sm:size-6" />
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-foreground text-xs sm:text-sm mb-1">
            {isCapturing
              ? "Capturing..."
              : isVideoReady
              ? "Tap to capture receipt"
              : "Preparing camera..."}
          </p>
          {isProcessing && (
            <p className="text-muted-foreground text-xs">Processing image...</p>
          )}
        </div>

        {/* Desktop Instructions */}
        <div className="hidden sm:block mt-4 text-center">
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>• Ensure good lighting</span>
            <span>• Keep receipt flat</span>
            <span>• Include full receipt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
