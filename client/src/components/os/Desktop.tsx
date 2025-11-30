import { useState, useCallback, useEffect, useRef } from "react";
import { StatusBar } from "./StatusBar";
import { AppDrawer } from "./AppDrawer";
import { HomeScreen } from "./HomeScreen";
import { VoiceOverlay } from "./VoiceOverlay";
import { SagiKeyboard } from "./SagiKeyboard";
import { Setup } from "@/pages/Setup";
import { TestingBoard } from "@/pages/TestingBoard";
import { ExploreSagi } from "../apps/ExploreSagi";
import { SagiRetail } from "../apps/SagiRetail";
import { Browser } from "../apps/Browser";
import { Calculator } from "../apps/Calculator";
import { Notes } from "../apps/Notes";
import { FileManager } from "../apps/FileManager";
import { Settings } from "../apps/Settings";
import { Photos } from "../apps/Photos";
import { Weather } from "../apps/Weather";
import { Videos } from "../apps/Videos";
import { Music } from "../apps/Music";
import { Mail } from "../apps/Mail";
import { Maps } from "../apps/Maps";
import { News } from "../apps/News";
import { Books } from "../apps/Books";
import { Mic, Grid2X2, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Screen = "home" | "browser" | "calculator" | "notes" | "files" | "settings" | "photos" | "weather" | "videos" | "music" | "mail" | "maps" | "news" | "books" | "explore" | "retail" | "testing-board";

export function Desktop() {
  const [isSetupComplete, setIsSetupComplete] = useState(localStorage.getItem("setupComplete") === "true");
  const [isTestingMode, setIsTestingMode] = useState(localStorage.getItem("isTestingMode") === "true");
  const [storeMode, setStoreMode] = useState(localStorage.getItem("storeMode") === "true");
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [screenHistory, setScreenHistory] = useState<Screen[]>(["home"]);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [globalKeyboardOpen, setGlobalKeyboardOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitUsername, setExitUsername] = useState("");
  const [exitPassword, setExitPassword] = useState("");
  const [exitError, setExitError] = useState("");
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
    } else if (lowerCommand.includes("videos")) {
      navigateTo("videos");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("music")) {
      navigateTo("music");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("mail")) {
      navigateTo("mail");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("maps")) {
      navigateTo("maps");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("news")) {
      navigateTo("news");
      setVoiceOpen(false);
    } else if (lowerCommand.includes("books")) {
      navigateTo("books");
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

  const handleTestingMode = (username: string) => {
    setIsTestingMode(true);
    setIsSetupComplete(true);
  };

  const handleStoreMode = (username: string) => {
    setStoreMode(true);
    setIsSetupComplete(true);
  };

  const handleTestingLogout = () => {
    setIsTestingMode(false);
    setIsSetupComplete(false);
  };

  const handleStoreModeExit = () => {
    if (exitUsername === "SAGI_RETAILMODE" && exitPassword === "retail553") {
      setStoreMode(false);
      setIsSetupComplete(false);
      localStorage.removeItem("storeMode");
      localStorage.removeItem("currentUser");
      setShowExitModal(false);
      setExitUsername("");
      setExitPassword("");
      setExitError("");
    } else {
      setExitError("Invalid credentials!");
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen 
            onOpenApp={navigateTo} 
            onOpenVoice={() => setVoiceOpen(true)}
            isStoreMode={storeMode}
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
        return <Settings onBack={goBack} isStoreMode={storeMode} />;
      case "photos":
        return <Photos onBack={goBack} />;
      case "weather":
        return <Weather onBack={goBack} />;
      case "videos":
        return <Videos onBack={goBack} />;
      case "music":
        return <Music onBack={goBack} />;
      case "mail":
        return <Mail onBack={goBack} />;
      case "maps":
        return <Maps onBack={goBack} />;
      case "news":
        return <News onBack={goBack} />;
      case "books":
        return <Books onBack={goBack} />;
      case "explore":
        return <ExploreSagi onBack={goBack} />;
      case "retail":
        return <SagiRetail onBack={goBack} onOpenSettings={() => navigateTo("settings")} />;
      case "testing-board":
        return (
          <TestingBoard 
            onLogout={goBack}
            onNavigateApp={(app) => navigateTo(app as Screen)}
          />
        );
      default:
        return null;
    }
  };

  if (isTestingMode) {
    return (
      <TestingBoard 
        onLogout={handleTestingLogout}
        onNavigateApp={(app) => {
          navigateTo(app as Screen);
          setIsTestingMode(false);
        }}
      />
    );
  }

  if (storeMode) {
    return (
      <>
        <div className="h-screen w-screen overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowExitModal(true)}
              data-testid="button-exit-store-mode"
            >
              Exit Store Mode
            </Button>
          </div>
          {renderScreen()}
        </div>

        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Exit Store Mode</DialogTitle>
              <DialogDescription>
                Enter credentials to exit Store Mode
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={exitUsername}
                  onChange={(e) => {
                    setExitUsername(e.target.value);
                    setExitError("");
                  }}
                  placeholder="SAGI_RETAILMODE"
                  className="mt-1"
                  data-testid="input-exit-username"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={exitPassword}
                  onChange={(e) => {
                    setExitPassword(e.target.value);
                    setExitError("");
                  }}
                  placeholder="••••••"
                  className="mt-1"
                  data-testid="input-exit-password"
                />
              </div>
              {exitError && (
                <p className="text-sm text-destructive">{exitError}</p>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExitModal(false);
                    setExitUsername("");
                    setExitPassword("");
                    setExitError("");
                  }}
                  className="flex-1"
                  data-testid="button-cancel-exit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStoreModeExit}
                  className="flex-1"
                  data-testid="button-confirm-exit"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (!isSetupComplete) {
    return <Setup onComplete={handleSetupComplete} onTestingMode={handleTestingMode} onStoreMode={handleStoreMode} />;
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
        {currentScreen === "home" ? (
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-secondary/80 hover:bg-secondary shadow-lg"
            onClick={() => setAppDrawerOpen(true)}
            data-testid="button-apps-persistent"
          >
            <Grid2X2 className="w-7 h-7" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-secondary/80 hover:bg-secondary shadow-lg"
            onClick={goBack}
            data-testid="button-back-persistent"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
        )}
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
        isStoreMode={storeMode}
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
