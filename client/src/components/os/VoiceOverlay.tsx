import { useState, useEffect, useRef } from "react";
import { Mic, X, ThumbsUp, ThumbsDown, Volume2, Keyboard, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SagiKeyboard } from "./SagiKeyboard";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: string[];
}

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  onKeyboardToggle?: (open: boolean) => void;
}

const suggestions = [
  "What's the weather like today?",
  "Open the web browser",
  "What time is it?",
  "Tell me a joke",
];

const STORAGE_KEY = "sagiConversationHistory";

export function VoiceOverlay({ isOpen, onClose, onCommand, onKeyboardToggle }: VoiceOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [allConversations, setAllConversations] = useState<Message[][]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (err) {
        console.error("Failed to load conversation history", err);
      }
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = async (suggestion: string) => {
    const context = getContext();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: suggestion,
      timestamp: new Date(),
      context,
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: suggestion,
          conversationHistory: context,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      const response = data.response;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        context,
      };
      setMessages(prev => [...prev, assistantMessage]);
      onCommand(suggestion);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm having trouble connecting to my AI. Please try again.",
        timestamp: new Date(),
        context,
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleTextMessage = async (text: string) => {
    const context = getContext();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
      context,
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: context,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      const response = data.response;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        context,
      };
      setMessages(prev => [...prev, assistantMessage]);
      onCommand(text);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm having trouble connecting to my AI. Please try again.",
        timestamp: new Date(),
        context,
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowHistory(false);
  };

  // Build context from recent messages
  const getContext = (): string[] => {
    return messages.slice(-4).map(m => `${m.type}: ${m.content}`);
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

  // History view
  if (showHistory) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] z-[300] flex flex-col" data-testid="voice-history">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Conversation History</h2>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={clearHistory}
              title="Clear all history"
              data-testid="button-clear-history"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowHistory(false)}
              data-testid="button-close-history"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No conversation history yet. Start chatting with Sagi!</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-card/40 rounded-xl p-4 border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-semibold ${msg.type === "user" ? "text-primary" : "text-accent"}`}>
                      {msg.type === "user" ? "You" : "Sagi"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isTextMode) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] z-[300] flex flex-col" data-testid="voice-overlay">
        <div className="absolute top-4 right-4 z-10">
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

        <div className="flex-1 overflow-auto pt-16 px-8 pb-4">
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
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-2xl text-muted-foreground">Start typing or use the microphone to chat</p>
              </div>
            </div>
          )}
        </div>

        <SagiKeyboard
          isOpen={isTextMode}
          onSend={handleTextMessage}
          onClose={() => {
            setIsTextMode(false);
            onKeyboardToggle?.(false);
          }}
          isListening={isListening}
          transcript={transcript}
        />
      </div>
    );
  }

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
            <Button
              size="icon"
              variant={isTextMode ? "default" : "secondary"}
              className="w-16 h-16 rounded-full"
              onClick={() => {
                setIsTextMode(!isTextMode);
                onKeyboardToggle?.(!isTextMode);
              }}
              data-testid="button-text-mode"
            >
              <Keyboard className="w-7 h-7" />
            </Button>
            {messages.length > 0 && (
              <Button
                size="icon"
                variant="secondary"
                className="w-16 h-16 rounded-full"
                onClick={() => setShowHistory(true)}
                title="View conversation history"
                data-testid="button-view-history"
              >
                <History className="w-7 h-7" />
              </Button>
            )}
          </div>

          {!isTextMode && (
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
          )}
        </div>
      </div>
    </div>
  );
}
