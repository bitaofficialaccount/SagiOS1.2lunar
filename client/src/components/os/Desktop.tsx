import { useState, useCallback, useEffect, useRef } from "react";
import { StatusBar } from "./StatusBar";
import { AppDrawer } from "./AppDrawer";
import { HomeScreen } from "./HomeScreen";
import { VoiceOverlay } from "./VoiceOverlay";
import { SagiKeyboard } from "./SagiKeyboard";
import { Setup } from "@/pages/Setup";
import { Browser } from "../apps/Browser";
import { Calculator } from "../apps/Calculator";
import { Notes } from "../apps/Notes";
import { FileManager } from "../apps/FileManager";
import { Settings } from "../apps/Settings";
import { Photos } from "../apps/Photos";
import { Weather } from "../apps/Weather";
import { Mic, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Screen = "home" | "browser" | "calculator" | "notes" | "files" | "settings" | "photos" | "weather";

export function Desktop() {
  const [isSetupComplete, setIsSetupComplete] = useState(localStorage.getItem("setupComplete") === "true");
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [screenHistory, setScreenHistory] = useState<Screen[]>(["home"]);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [globalKeyboardOpen, setGlobalKeyboardOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!isSetupComplete) {
      setIsSetupComplete(false);
    }
  }, []);

  const navigateTo = useCallback((screen: string) => {
    const validScreen = screen as Screen;
    setCurrentScreen(validScreen);
    setScreenHistory(prev => [...prev, validScreen]);
  }, []);

  const goBack = useCallback(() => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      setScreenHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
    }
  }, [screenHistory]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    if (deltaY > 100 && currentScreen === "home") {
      setAppDrawerOpen(true);
    }
    if (deltaY < -100 && currentScreen !== "home") {
      goBack();
    }
  };

  const handleVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes("browser") || lowerCommand.includes("web")) {
      navigateTo("browser");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("calculator")) {
      navigateTo("calculator");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("notes")) {
      navigateTo("notes");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("files") || lowerCommand.includes("file manager")) {
      navigateTo("files");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("settings")) {
      navigateTo("settings");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("photos")) {
      navigateTo("photos");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("weather")) {
      navigateTo("weather");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("home")) {
      navigateTo("home");
      setVoiceOpen(false);
    }
  }, [navigateTo]);

  const handleSagiMessage = (message: string) => {
    handleVoiceCommand(message);
    setTranscript("");
  };

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    localStorage.setItem("setupComplete", "true");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen 
            onOpenApp={navigateTo} 
            onOpenVoice={() => setVoiceOpen(true)}
          />
        );
      case "browser":
        return <Browser onBack={goBack} />;
      case "calculator":
        return <Calculator onBack={goBack} />;
      case "notes":
        return <Notes onBack={goBack} />;
      case "files":
        return <FileManager onBack={goBack} />;
      case "settings":
        return <Settings onBack={goBack} />;
      case "photos":
        return <Photos onBack={goBack} />;
      case "weather":
        return <Weather onBack={goBack} />;
      default:
        return null;
    }
  };

  if (!isSetupComplete) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] relative"
      data-testid="desktop"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {!globalKeyboardOpen && !voiceOpen && !appDrawerOpen && (
        <StatusBar />
      )}

      <div className="h-full w-full animate-fade-in">
        {renderScreen()}
      </div>

      {/* Persistent Buttons at Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[200] flex gap-4">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full bg-secondary/80 hover:bg-secondary shadow-lg"
          onClick={() => setAppDrawerOpen(true)}
          data-testid="button-apps-persistent"
        >
          <Grid2X2 className="w-7 h-7" />
        </Button>
        <Button
          size="icon"
          className="w-16 h-16 rounded-full bg-primary/90 hover:bg-primary shadow-lg shadow-primary/50"
          onClick={() => setVoiceOpen(true)}
          data-testid="button-sagi-persistent"
        >
          <Mic className="w-7 h-7" />
        </Button>
      </div>

      <AppDrawer
        isOpen={appDrawerOpen}
        onClose={() => setAppDrawerOpen(false)}
        onNavigate={navigateTo}
        currentScreen={currentScreen}
      />

      <VoiceOverlay
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onCommand={handleVoiceCommand}
        onKeyboardToggle={setGlobalKeyboardOpen}
      />

      <SagiKeyboard
        isOpen={globalKeyboardOpen}
        onSend={handleSagiMessage}
        onClose={() => setGlobalKeyboardOpen(false)}
        isListening={isListening}
        transcript={transcript}
      />
    </div>
  );
}
