import { useState } from "react";
import { Globe, MessageCircle, Volume2, Wifi, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SetupProps {
  onComplete: () => void;
}

export function Setup({ onComplete }: SetupProps) {
  const [step, setStep] = useState<"welcome" | "wifi" | "language" | "microphone" | "complete">("welcome");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [wifiConnected, setWifiConnected] = useState(false);
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [networkName, setNetworkName] = useState("");

  const handleMicrophoneTest = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneGranted(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-12">
        {/* Welcome Step */}
        {step === "welcome" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-4">Hello!</h1>
              <p className="text-xl text-muted-foreground mb-2">Welcome to Sagi</p>
              <p className="text-base text-muted-foreground">Your AI-powered smart assistant. Let's get you set up.</p>
            </div>
            <Button
              size="lg"
              className="w-full h-14 text-lg rounded-full"
              onClick={() => setStep("wifi")}
              data-testid="button-setup-start"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* WiFi Step */}
        {step === "wifi" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Connect to WiFi</h2>
              <p className="text-muted-foreground">Choose your network (offline mode available)</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Network Name</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-card/40 backdrop-blur-md border border-border/50">
                  <Wifi className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={networkName}
                    onChange={(e) => setNetworkName(e.target.value)}
                    placeholder="Enter network name or skip"
                    className="border-0 bg-transparent text-base"
                    data-testid="input-wifi-name"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("language")}
                data-testid="button-skip-wifi"
              >
                Skip (Offline)
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => {
                  setWifiConnected(true);
                  setStep("language");
                }}
                data-testid="button-connect-wifi"
              >
                Connect
              </Button>
            </div>
          </div>
        )}

        {/* Language Step */}
        {step === "language" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Select Language</h2>
              <p className="text-muted-foreground">Choose your preferred language</p>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`w-full p-4 rounded-xl text-lg font-medium transition-all ${
                    selectedLanguage === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/40 backdrop-blur-md border border-border/50 hover-elevate"
                  }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                  data-testid={`button-language-${lang.code}`}
                >
                  <span className="text-2xl mr-3">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("wifi")}
                data-testid="button-back-language"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("microphone")}
                data-testid="button-next-language"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Microphone Step */}
        {step === "microphone" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Test Microphone</h2>
              <p className="text-muted-foreground">Enable microphone access for voice commands</p>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center mx-auto">
                  <Volume2 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Say "Hey, Sagi"</p>
                <p className="text-sm text-muted-foreground">
                  {microphoneGranted ? "✓ Microphone is working" : "Tap to enable microphone"}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg rounded-full"
              onClick={handleMicrophoneTest}
              variant={microphoneGranted ? "default" : "secondary"}
              data-testid="button-test-mic"
            >
              {microphoneGranted ? "✓ Microphone Ready" : "Enable Microphone"}
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("language")}
                data-testid="button-back-mic"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("complete")}
                data-testid="button-next-mic"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full bg-green-500/30 flex items-center justify-center">
                <Globe className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">All Set!</h1>
              <p className="text-lg text-muted-foreground">You're ready to use Sagi. Say "Hey, Sagi" anytime.</p>
            </div>
            <Button
              size="lg"
              className="w-full h-14 text-lg rounded-full"
              onClick={onComplete}
              data-testid="button-setup-complete"
            >
              Start Using Sagi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
