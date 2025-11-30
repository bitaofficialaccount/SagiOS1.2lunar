import { useState, useRef } from "react";
import { Send, Mic, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SagiKeyboardProps {
  isOpen: boolean;
  onSend?: (message: string) => void;
  onClose: () => void;
  onKeyPress?: (key: string) => void;
  isListening?: boolean;
  transcript?: string;
}

const keyboardRows = [
  [
    { label: "Esc", special: true },
    { label: "-", char: "-" },
    { label: "=", char: "=" },
    { label: "Del", special: true },
  ],
  [
    { label: "Tab", special: true },
    { label: "1", char: "1" },
    { label: "2", char: "2" },
    { label: "3", char: "3" },
    { label: "4", char: "4" },
    { label: "5", char: "5" },
    { label: "6", char: "6" },
    { label: "7", char: "7" },
    { label: "8", char: "8" },
    { label: "9", char: "9" },
    { label: "0", char: "0" },
    { label: "-", char: "-" },
    { label: "=", char: "=" },
  ],
  [
    { label: "Caps", special: true },
    { label: "Q", char: "q" },
    { label: "W", char: "w" },
    { label: "E", char: "e" },
    { label: "R", char: "r" },
    { label: "T", char: "t" },
    { label: "Y", char: "y" },
    { label: "U", char: "u" },
    { label: "I", char: "i" },
    { label: "O", char: "o" },
    { label: "P", char: "p" },
    { label: "[", char: "[" },
    { label: "]", char: "]" },
  ],
  [
    { label: "Shift", special: true },
    { label: "A", char: "a" },
    { label: "S", char: "s" },
    { label: "D", char: "d" },
    { label: "F", char: "f" },
    { label: "G", char: "g" },
    { label: "H", char: "h" },
    { label: "J", char: "j" },
    { label: "K", char: "k" },
    { label: "L", char: "l" },
    { label: ";", char: ";" },
    { label: "'", char: "'" },
  ],
  [
    { label: "Shift", special: true },
    { label: "Z", char: "z" },
    { label: "X", char: "x" },
    { label: "C", char: "c" },
    { label: "V", char: "v" },
    { label: "B", char: "b" },
    { label: "N", char: "n" },
    { label: "M", char: "m" },
    { label: ",", char: "," },
    { label: ".", char: "." },
    { label: "/", char: "/" },
  ],
];

export function SagiKeyboard({ isOpen, onSend, onClose, onKeyPress, isListening, transcript }: SagiKeyboardProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (char: string) => {
    const newInput = input + char;
    setInput(newInput);
    if (onKeyPress) {
      onKeyPress(char);
    }
  };

  const startListening = () => {
    setIsRecording(true);
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const text = result[0].transcript;
      setInput(prev => prev + text);
      
      if (result.isFinal) {
        setIsRecording(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2a2a2a] border-t border-border/50 backdrop-blur-xl z-[250] p-2">
      <div className="max-w-full mx-auto space-y-1">
        {/* Virtual Keyboard */}
        <div className="space-y-1">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-0.5 px-2">
              {row.map((key, keyIndex) => (
                <button
                  key={`${rowIndex}-${keyIndex}`}
                  onClick={() => {
                    if (key.char) {
                      handleKeyPress(key.char);
                    }
                  }}
                  className={`${
                    key.special ? "px-3" : "px-2"
                  } py-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] active-elevate-2 rounded text-xs font-medium border border-[#555] transition-all ${
                    key.label === "Mic" ? "text-primary" : ""
                  }`}
                  data-testid={`key-${key.label}`}
                >
                  {key.label}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom Row - Space, Mic, Backspace, Enter */}
          <div className="flex justify-center gap-0.5 px-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 h-8 rounded text-xs"
              onClick={() => handleKeyPress(" ")}
              data-testid="key-space"
            >
              Space
            </Button>
            <Button
              size="sm"
              variant={isRecording ? "default" : "secondary"}
              className={`h-8 rounded text-xs ${isRecording ? "bg-primary animate-pulse" : ""}`}
              onClick={startListening}
              data-testid="button-mic-keyboard"
            >
              <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 rounded text-xs"
              onClick={() => setInput(input.slice(0, -1))}
              data-testid="button-backspace"
            >
              <Delete className="w-4 h-4" />
            </Button>
            {onSend && (
              <Button
                size="sm"
                className="h-8 rounded text-xs"
                onClick={handleSend}
                disabled={!input.trim()}
                data-testid="button-send-keyboard"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 rounded text-xs"
              onClick={onClose}
              data-testid="button-close-keyboard"
            >
              <span className="text-lg">×</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
