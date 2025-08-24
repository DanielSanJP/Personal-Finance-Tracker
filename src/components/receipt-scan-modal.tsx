"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  CheckCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ReceiptData {
  merchant?: string;
  amount?: string;
  date?: Date;
  items?: string[];
  category?: string;
}

interface ReceiptScanModalProps {
  isProcessing: boolean;
  parsedData: ReceiptData;
  confidence: number;
  previewUrl?: string | null;
  onScanFromFile: (file: File) => void;
  onScanFromCamera: () => Promise<{
    video: HTMLVideoElement;
    stream: MediaStream;
  }>;
  onCaptureFromVideo: (video: HTMLVideoElement) => Promise<File>;
  onClearPreview: () => void;
  isSupported?: boolean;
}

export const ReceiptScanModal = ({
  isProcessing,
  parsedData,
  confidence,
  previewUrl,
  onScanFromFile,
  onScanFromCamera,
  onCaptureFromVideo,
  onClearPreview,
  isSupported = true,
}: ReceiptScanModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [videoStream, setVideoStream] = useState<{
    video: HTMLVideoElement;
    stream: MediaStream;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update screen dimensions when camera modal opens
  useEffect(() => {
    if (cameraModalOpen) {
      const updateDimensions = () => {
        setScreenDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      window.addEventListener("orientationchange", updateDimensions);

      return () => {
        window.removeEventListener("resize", updateDimensions);
        window.removeEventListener("orientationchange", updateDimensions);
      };
    }
  }, [cameraModalOpen]);

  // Calculate dynamic bottom padding based on screen height
  const getBottomPadding = () => {
    const { height } = screenDimensions;

    // For very small screens (iPhone SE, etc.)
    if (height <= 667) return "pb-2";

    // For medium screens (iPhone 12, 13, etc.)
    if (height <= 844) return "pb-4";

    // For larger screens (iPhone 14 Pro Max, etc.)
    return "pb-6";
  };

  // Calculate button size based on screen dimensions
  const getButtonSize = () => {
    const { height, width } = screenDimensions;
    const minDimension = Math.min(height, width);

    // Smaller button for very small screens
    if (minDimension <= 375) return { size: "w-16 h-16", icon: "w-8 h-8" };

    // Standard button for most screens
    return { size: "w-20 h-20", icon: "w-10 h-10" };
  };

  // Calculate controls container height to ensure it fits
  const getControlsHeight = () => {
    const { height } = screenDimensions;

    // Reserve less space on smaller screens
    if (height <= 667) return "min-h-[120px] max-h-[140px]";
    if (height <= 844) return "min-h-[140px] max-h-[160px]";

    return "min-h-[160px] max-h-[180px]";
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleCloseCamera();
      onClearPreview();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onScanFromFile(file);
    }
  };

  const handleCameraStart = async () => {
    try {
      setCameraModalOpen(true);
      const stream = await onScanFromCamera();
      setVideoStream(stream);
    } catch {
      setCameraModalOpen(false);
    }
  };

  const handleCapture = async () => {
    if (videoStream) {
      try {
        const file = await onCaptureFromVideo(videoStream.video);
        handleCloseCamera();
        await onScanFromFile(file);
      } catch (error) {
        console.error("Failed to capture image:", error);
      }
    }
  };

  const handleCloseCamera = () => {
    if (videoStream) {
      videoStream.stream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setCameraModalOpen(false);
  };

  // Show different button state if not supported
  if (!isSupported) {
    return (
      <Button
        className="w-40 min-w-32"
        type="button"
        variant="outline"
        disabled
        title="Receipt scanning not supported in this browser"
      >
        <Camera className="w-4 h-4 mr-2" />
        Scan Receipt
      </Button>
    );
  }

  return (
    <>
      {/* Fullscreen Camera Modal */}
      {cameraModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
          style={{ height: "100dvh" }} // Use dynamic viewport height for better mobile support
        >
          {/* Camera Header */}
          <div className="flex items-center justify-between p-4 bg-black/80 text-white shrink-0">
            <h2 className="text-lg font-semibold">Camera</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseCamera}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Camera View - Takes remaining space */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{ minHeight: 0 }}
          >
            {videoStream && (
              <video
                ref={(video) => {
                  if (video && videoStream.video !== video) {
                    video.srcObject = videoStream.stream;
                    video.play();
                  }
                }}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            )}
          </div>

          {/* Camera Controls - Fixed at bottom with dynamic positioning */}
          <div
            className={`shrink-0 bg-black/90 px-6 py-3 ${getBottomPadding()} ${getControlsHeight()} flex flex-col justify-center`}
            style={{
              position: "relative",
              bottom: 0,
              maxHeight: "25vh", // Never take more than 25% of viewport height
            }}
          >
            <div className="flex justify-center mb-2">
              <Button
                onClick={handleCapture}
                disabled={isProcessing}
                size="lg"
                className={`rounded-full ${
                  getButtonSize().size
                } bg-white text-black hover:bg-gray-200 shadow-lg border-4 border-gray-300 flex items-center justify-center`}
              >
                <Camera className={getButtonSize().icon} />
              </Button>
            </div>
            <p className="text-white text-center text-xs sm:text-sm leading-tight">
              Position receipt in frame and tap to capture
            </p>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-40 min-w-32" type="button" variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Scan Receipt
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg max-w-[95vw] w-full mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receipt Scanner</DialogTitle>
          </DialogHeader>

          <div className="space-y-1 sm:space-y-2">
            {/* Image Preview */}
            {previewUrl && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Receipt Image
                    </CardTitle>
                    {confidence >= 70 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="w-full max-h-48 sm:max-h-80 object-contain rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scanning Status */}
            <Card className="gap-1">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-2 h-2 rounded-full animate-pulse" />
                      Processing receipt...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Ready to scan
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Parsed Data Preview */}
                {Object.keys(parsedData).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Detected:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {parsedData.amount && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs"
                        >
                          ${parsedData.amount}
                        </Badge>
                      )}
                      {parsedData.merchant && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs"
                        >
                          {parsedData.merchant}
                        </Badge>
                      )}
                      {parsedData.category && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs"
                        >
                          {parsedData.category}
                        </Badge>
                      )}
                      {parsedData.date && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs"
                        >
                          {parsedData.date.toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Control Buttons */}
                {!cameraModalOpen && !previewUrl && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleCameraStart}
                      disabled={isProcessing}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Camera
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}

                {/* Done Button - Show when we have parsed data */}
                {Object.keys(parsedData).length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    className="w-full mt-2"
                  >
                    Done
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Examples */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <strong>Tips:</strong>
              </p>
              <p>• Ensure receipt is well-lit and flat</p>
              <p>• Include the total amount in the image</p>
              <p>• Works best with printed receipts</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        aria-label="Upload receipt image"
      />
    </>
  );
};
