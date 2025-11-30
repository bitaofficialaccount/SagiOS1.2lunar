import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  onStateChange?: (state: VoiceState) => void;
}

export function VoiceAssistant({ onCommand, onStateChange }: VoiceAssistantProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognitionInstance;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript.toLowerCase();
      
      setTranscript(text);
      
      if (result.isFinal) {
        // Get custom pronunciation from localStorage
        const customPronunciation = localStorage.getItem("sagiPronunciation") || "Hey S-A-G-I";
        const wakeWordVariants = [
          "hey sagi",
          "hey sagie",
          "hey saggy",
          customPronunciation.toLowerCase(),
        ];
        
        const wakeWordDetected = wakeWordVariants.some(variant => 
          text.includes(variant.toLowerCase())
        );
        
        if (wakeWordDetected) {
          setState("listening");
          onStateChange?.("listening");
          setTranscript("");
          // Flash green visual feedback
          const elem = document.querySelector('[data-testid="voice-assistant-feedback"]');
          if (elem) {
            elem.classList.add("animate-pulse");
            setTimeout(() => elem.classList.remove("animate-pulse"), 500);
          }
        } else if (state === "listening") {
          handleCommand(text);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (import.meta.env.DEV) {
        console.log("Speech recognition error:", event.error);
      }
      if (event.error !== "no-speech") {
        setState("idle");
      }
    };

    recognition.onend = () => {
      if (state === "listening") {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [state, onStateChange]);

  const handleCommand = useCallback((command: string) => {
    setState("processing");
    onStateChange?.("processing");
    onCommand?.(command);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "time": `The current time is ${new Date().toLocaleTimeString()}`,
        "date": `Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
        "hello": "Hello! How can I help you today?",
        "weather": "I'm sorry, I don't have access to weather data yet, but I'm working on it!",
        "open calculator": "Opening calculator for you.",
        "open notes": "Opening notes application.",
        "open files": "Opening file manager.",
        "open settings": "Opening settings.",
      };

      let responseText = "I heard you say: " + command;
      for (const [key, value] of Object.entries(responses)) {
        if (command.includes(key)) {
          responseText = value;
          break;
        }
      }

      setResponse(responseText);
      speak(responseText);
    }, 500);
  }, [onCommand, onStateChange]);

  const speak = (text: string) => {
    setState("speaking");
    onStateChange?.("speaking");
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setState("idle");
      onStateChange?.("idle");
      setTranscript("");
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (state === "idle") {
      recognitionRef.current.start();
      setState("listening");
      onStateChange?.("listening");
    } else {
      recognitionRef.current.stop();
      window.speechSynthesis.cancel();
      setState("idle");
      onStateChange?.("idle");
      setTranscript("");
      setResponse("");
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MicOff className="w-6 h-6" />
        <span className="text-xs">Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {state !== "idle" && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse-ring-outer" />
          </>
        )}
        
        <Button
          size="icon"
          variant={state === "idle" ? "secondary" : "default"}
          className={`relative z-10 w-12 h-12 rounded-full transition-all ${
            state !== "idle" ? "bg-primary shadow-lg shadow-primary/50" : ""
          }`}
          onClick={toggleListening}
          data-testid="button-voice-toggle"
        >
          {state === "speaking" ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <Mic className={`w-5 h-5 ${state === "listening" ? "animate-pulse" : ""}`} />
          )}
        </Button>
      </div>

      {state === "listening" && (
        <div className="flex gap-1 h-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {transcript && state === "listening" && (
        <div className="px-4 py-2 bg-card/80 backdrop-blur-md rounded-lg text-sm max-w-xs text-center animate-fade-in" data-testid="text-transcript">
          {transcript}
        </div>
      )}

      {response && (state === "speaking" || state === "processing") && (
        <div className="px-4 py-3 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-lg text-sm max-w-sm text-center animate-slide-up" data-testid="text-response">
          <p className="text-foreground">{response}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {state === "idle" ? 'Say "Hey, Sagi" or click to activate' : 
         state === "listening" ? "Listening..." :
         state === "processing" ? "Processing..." : "Speaking..."}
      </p>
    </div>
  );
}

