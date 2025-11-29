import { useState } from "react";
import { 
  Monitor, 
  Volume2, 
  Wifi, 
  Mic, 
  Bell, 
  Lock, 
  Palette,
  User,
  Info,
  ArrowLeft
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SettingsProps {
  onBack?: () => void;
}

const sections: SettingsSection[] = [
  { id: "voice", name: "Voice Assistant", icon: <Mic className="w-6 h-6" /> },
  { id: "sound", name: "Sound", icon: <Volume2 className="w-6 h-6" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-6 h-6" /> },
  { id: "privacy", name: "Privacy", icon: <Lock className="w-6 h-6" /> },
  { id: "personalization", name: "Personalization", icon: <Palette className="w-6 h-6" /> },
  { id: "account", name: "Account", icon: <User className="w-6 h-6" /> },
  { id: "about", name: "About", icon: <Info className="w-6 h-6" /> },
];

export function Settings({ onBack }: SettingsProps) {
  const [activeSection, setActiveSection] = useState("voice");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [speechRate, setSpeechRate] = useState([50]);
  const [microphoneStatus, setMicrophoneStatus] = useState("ready");
  const [isTesting, setIsTesting] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-settings-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>
    <div className="flex flex-1 overflow-hidden">
      <div className="w-64 border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-base transition-colors ${
                  activeSection === section.id 
                    ? "bg-primary/20 text-foreground" 
                    : "hover-elevate active-elevate-2"
                }`}
                onClick={() => setActiveSection(section.id)}
                data-testid={`settings-section-${section.id}`}
              >
                <span className="text-primary">{section.icon}</span>
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeSection === "voice" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">Voice Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Configure Sagi voice assistant settings
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-enabled">Enable Voice Assistant</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow Sagi to listen for voice commands
                  </p>
                </div>
                <Switch 
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                  data-testid="switch-voice-enabled"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="wake-word">Wake Word Detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Respond to "Hey, Sagi" wake word
                  </p>
                </div>
                <Switch 
                  id="wake-word"
                  checked={wakeWordEnabled}
                  onCheckedChange={setWakeWordEnabled}
                  disabled={!voiceEnabled}
                  data-testid="switch-wake-word"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Response Volume</Label>
                  <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  disabled={!voiceEnabled}
                  data-testid="slider-volume"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Speech Rate</Label>
                  <span className="text-sm text-muted-foreground">
                    {speechRate[0] < 30 ? "Slow" : speechRate[0] > 70 ? "Fast" : "Normal"}
                  </span>
                </div>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={100}
                  step={1}
                  disabled={!voiceEnabled}
                  data-testid="slider-speech-rate"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-4">Test Microphone</h3>
              <p className="text-xs text-muted-foreground mb-3">Try saying "Hey, Sagi" to test voice activation</p>
              <Button
                onClick={async () => {
                  setIsTesting(true);
                  try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    setMicrophoneStatus("working");
                  } catch (err) {
                    setMicrophoneStatus("error");
                  }
                  setIsTesting(false);
                }}
                disabled={isTesting}
                className="w-full"
                data-testid="button-test-microphone"
              >
                {isTesting ? "Testing..." : "Test Microphone"}
              </Button>
              {microphoneStatus === "working" && (
                <p className="text-xs text-green-400 mt-2">✓ Microphone is working</p>
              )}
              {microphoneStatus === "error" && (
                <p className="text-xs text-red-400 mt-2">✗ Microphone access denied</p>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Voice Commands</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>"Hey, Sagi" - Activate assistant</p>
                <p>"What time is it?" - Get current time</p>
                <p>"Open calculator" - Launch calculator app</p>
                <p>"Open notes" - Launch notes app</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "about" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">About SagiOS</h2>
              <p className="text-sm text-muted-foreground">
                System information and credits
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span>Web Browser</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voice Engine</span>
                <span>Web Speech API</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Backend</span>
                <span>OpenAI</span>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm">
                SagiOS is a voice-activated web operating system with integrated AI assistance. 
                Say "Hey, Sagi" to activate voice commands.
              </p>
            </div>
          </div>
        )}

        {activeSection === "display" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">Display Settings</h2>
              <p className="text-sm text-muted-foreground">
                Adjust display preferences
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Always use dark theme
                </p>
              </div>
              <Switch checked={true} data-testid="switch-dark-mode" />
            </div>
          </div>
        )}

        {!["voice", "about", "display"].includes(activeSection) && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-lg">Settings for {sections.find(s => s.id === activeSection)?.name} coming soon</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
