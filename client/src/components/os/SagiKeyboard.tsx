import { useState, useRef } from "react";
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
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export function SagiKeyboard({ isOpen, onSend, onClose, isListening, transcript }: SagiKeyboardProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (key: string) => {
    setInput(prev => prev + key.toLowerCase());
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628] to-[#1a2942] border-t border-border/50 backdrop-blur-xl z-[250] p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Input Display */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card/40 rounded-xl border border-border/50 min-h-12">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
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
        <div className="space-y-1.5">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {rowIndex === 2 && <div className="w-5" />}
              {rowIndex === 3 && <div className="w-10" />}
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="px-2 py-2 min-w-10 bg-card/60 hover-elevate active-elevate-2 rounded text-sm font-medium border border-border/30 transition-all"
                  data-testid={`key-${key}`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom Row - Space, Period, Question */}
          <div className="flex justify-center gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 rounded"
              onClick={() => setInput(prev => prev + " ")}
              data-testid="key-space"
            >
              Space
            </Button>
            <button
              onClick={() => handleKeyPress(".")}
              className="px-2 py-2 min-w-10 bg-card/60 hover-elevate active-elevate-2 rounded text-sm font-medium border border-border/30"
              data-testid="key-period"
            >
              .
            </button>
            <button
              onClick={() => handleKeyPress("?")}
              className="px-2 py-2 min-w-10 bg-card/60 hover-elevate active-elevate-2 rounded text-sm font-medium border border-border/30"
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
            variant={isRecording ? "default" : "secondary"}
            className={`w-12 h-12 rounded-full ${isRecording ? "bg-primary animate-pulse" : ""}`}
            onClick={startListening}
            data-testid="button-mic-keyboard"
          >
            <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
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
