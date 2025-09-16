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
import { Mic, MicOff, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ParsedTransaction {
  amount?: string;
  description?: string;
  merchant?: string;
  category?: string;
  account?: string;
  date?: Date;
}

interface VoiceInputModalProps {
  isRecording: boolean;
  isProcessing: boolean;
  parsedData?: ParsedTransaction;
  confidence: number;
  onStartListening: () => void;
  onStopListening: () => void;
  isSupported?: boolean;
  type?: "expense" | "income";
}

export const VoiceInputModal = ({
  isRecording,
  isProcessing,
  parsedData,
  confidence,
  onStartListening,
  onStopListening,
  isSupported = true,
  type = "expense",
}: VoiceInputModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStart = () => {
    setIsOpen(true);
    // Don't auto-start recording - wait for user to click
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onStopListening();
    }
  };

  // Show different button state if not supported
  if (!isSupported) {
    return (
      <Button
        className="w-40 min-w-32"
        type="button"
        variant="outline"
        disabled
        title="Voice input not supported in this browser"
      >
        <MicOff className="w-4 h-4 mr-2" />
        Voice Input
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-40 min-w-32"
          type="button"
          variant="outline"
          onClick={handleStart}
        >
          <Mic className="w-4 h-4 mr-2" />
          Voice Input
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Voice Input Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recording Status */}
          <Card
            className={
              isRecording ? "border-red-300 bg-red-50" : "border-gray-200"
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4" />
                      Ready to listen
                    </>
                  )}
                </CardTitle>
                {confidence >= 70 && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Parsed Data Preview */}
              {parsedData && Object.keys(parsedData).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Detected:</p>
                  <div className="flex flex-wrap gap-1">
                    {parsedData.amount && (
                      <Badge variant="secondary" className="text-xs">
                        ${parsedData.amount}
                      </Badge>
                    )}
                    {parsedData.description && (
                      <Badge variant="secondary" className="text-xs">
                        {parsedData.description}
                      </Badge>
                    )}
                    {parsedData.merchant && (
                      <Badge variant="secondary" className="text-xs">
                        @{parsedData.merchant}
                      </Badge>
                    )}
                    {parsedData.category && (
                      <Badge variant="secondary" className="text-xs">
                        {parsedData.category}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Control Button */}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? onStopListening : onStartListening}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  "Processing..."
                ) : isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>

              {/* Done Button - Show when we have parsed data */}
              {parsedData && Object.keys(parsedData).length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (isRecording) {
                      onStopListening();
                    }
                    handleOpenChange(false);
                  }}
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
              <strong>Examples:</strong>
            </p>
            {type === "income" ? (
              <>
                <p>• &quot;50 dollars for salary&quot;</p>
                <p>• &quot;1500 freelance payment&quot;</p>
                <p>• &quot;200 gift from family&quot;</p>
              </>
            ) : (
              <>
                <p>• &quot;25 dollars for lunch at Chipotle&quot;</p>
                <p>• &quot;50 dollars petrol at BP&quot;</p>
                <p>• &quot;15 coffee&quot;</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
