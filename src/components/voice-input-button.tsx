import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStartListening: () => void;
  className?: string;
}

export const VoiceInputButton = ({
  isListening,
  isSupported,
  onStartListening,
  className = "w-40 min-w-32",
}: VoiceInputButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onStartListening}
      variant={isListening ? "default" : "outline"}
      className={`${className} ${
        isListening
          ? "animate-pulse bg-red-500 hover:bg-red-600 text-white"
          : ""
      }`}
      disabled={!isSupported}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 mr-2" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Voice Input
        </>
      )}
    </Button>
  );
};
