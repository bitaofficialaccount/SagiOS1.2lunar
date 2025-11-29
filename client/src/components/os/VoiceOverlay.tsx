import { useState, useEffect, useRef } from "react";
import { Mic, X, ThumbsUp, ThumbsDown, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

const suggestions = [
  "What's the weather like today?",
  "Open the web browser",
  "What time is it?",
  "Tell me a joke",
];

export function VoiceOverlay({ isOpen, onClose, onCommand }: VoiceOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: suggestion,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const response = generateResponse(suggestion);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      onCommand(suggestion);
    }, 500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("weather")) {
      return "It's currently 65°F and sunny in your area. Great weather for outdoor activities!";
    }
    if (lowerQuery.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}.`;
    }
    if (lowerQuery.includes("joke")) {
      return "Why do programmers prefer dark mode? Because light attracts bugs!";
    }
    if (lowerQuery.includes("browser")) {
      return "Opening the web browser for you.";
    }
    return "I heard your request. How else can I help you?";
  };

  const startListening = () => {
    setIsListening(true);
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const text = result[0].transcript;
      setTranscript(text);
      
      if (result.isFinal) {
        handleSuggestionClick(text);
        setTranscript("");
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] z-[300]" data-testid="voice-overlay">
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full"
          onClick={onClose}
          data-testid="button-close-voice"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col h-full pt-16 pb-8 px-8">
        <div className="flex-1 overflow-auto">
          {messages.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "user" ? (
                    <div className="bg-primary/30 backdrop-blur-md rounded-2xl px-6 py-3 max-w-md border border-primary/50">
                      <p className="text-lg">{message.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-2xl">
                      <p className="text-xl leading-relaxed mb-4">{message.content}</p>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full">
                          <ThumbsUp className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="w-10 h-10 rounded-full">
                          <ThumbsDown className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative inline-block mb-8">
                  <div className={`w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center ${isListening ? "animate-pulse-ring" : ""}`}>
                    <Mic className="w-10 h-10 text-primary" />
                  </div>
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
                      <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse-ring-outer" />
                    </>
                  )}
                </div>
                <p className="text-2xl mb-2">
                  {isListening ? "Listening..." : transcript || 'Say "Hey, Sagi" or tap to speak'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-4 justify-center mb-6">
            <Button
              size="icon"
              variant={isListening ? "default" : "secondary"}
              className={`w-16 h-16 rounded-full ${isListening ? "bg-primary" : ""}`}
              onClick={startListening}
              data-testid="button-voice-mic"
            >
              {isSpeaking ? (
                <Volume2 className="w-7 h-7" />
              ) : (
                <Mic className={`w-7 h-7 ${isListening ? "animate-pulse" : ""}`} />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-5 py-3 bg-card/40 backdrop-blur-md rounded-full text-sm border border-border/50 hover-elevate active-elevate-2 transition-all"
                onClick={() => handleSuggestionClick(suggestion)}
                data-testid={`suggestion-${index}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
