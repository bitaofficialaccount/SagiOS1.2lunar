import { useState } from "react";
import { Send, Mic, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SagiKeyboardProps {
  isOpen: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
  isListening?: boolean;
  transcript?: string;
}

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export function SagiKeyboard({ isOpen, onSend, onClose, isListening, transcript }: SagiKeyboardProps) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (key: string) => {
    setInput(prev => prev + key);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628] to-[#1a2942] border-t border-border/50 backdrop-blur-xl z-[250] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Input Display */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card/40 rounded-xl border border-border/50 min-h-12">
          <input
            type="text"
            value={input || transcript}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type to Sagi..."}
            className="flex-1 bg-transparent outline-none text-lg"
            data-testid="input-sagi-text"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setInput(input.slice(0, -1))}
            className="h-8 w-8"
            data-testid="button-backspace"
          >
            <Delete className="w-4 h-4" />
          </Button>
        </div>

        {/* Virtual Keyboard */}
        <div className="space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="px-3 py-2 min-w-8 h-8 bg-card/50 hover-elevate active-elevate-2 rounded-md text-sm font-medium transition-all"
                  data-testid={`key-${key}`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom Row */}
          <div className="flex justify-center gap-1">
            <button
              onClick={() => setInput(prev => prev + " ")}
              className="flex-1 px-3 py-2 h-8 bg-card/50 hover-elevate active-elevate-2 rounded-md text-sm font-medium"
              data-testid="key-space"
            >
              Space
            </button>
            <button
              onClick={() => handleKeyPress(".")}
              className="px-3 py-2 h-8 bg-card/50 hover-elevate active-elevate-2 rounded-md text-sm"
              data-testid="key-period"
            >
              .
            </button>
            <button
              onClick={() => handleKeyPress("?")}
              className="px-3 py-2 h-8 bg-card/50 hover-elevate active-elevate-2 rounded-md text-sm"
              data-testid="key-question"
            >
              ?
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full"
            onClick={onClose}
            data-testid="button-close-keyboard"
          >
            <span className="text-xl">×</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-12 h-12 rounded-full"
            data-testid="button-mic-keyboard"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={handleSend}
            disabled={!input.trim()}
            data-testid="button-send-keyboard"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
