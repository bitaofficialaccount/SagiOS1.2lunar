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
  ArrowLeft,
  CloudRain,
  RotateCcw,
  Paintbrush,
  Code
} from "lucide-react";
import { themes, getTheme } from "@/lib/themes";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SettingsProps {
  onBack?: () => void;
  isStoreMode?: boolean;
}

const sections: SettingsSection[] = [
  { id: "voice", name: "Voice Assistant", icon: <Mic className="w-6 h-6" /> },
  { id: "weather", name: "Weather", icon: <CloudRain className="w-6 h-6" /> },
  { id: "sound", name: "Sound", icon: <Volume2 className="w-6 h-6" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-6 h-6" /> },
  { id: "privacy", name: "Privacy", icon: <Lock className="w-6 h-6" /> },
  { id: "personalization", name: "Personalization", icon: <Palette className="w-6 h-6" /> },
  { id: "account", name: "Account", icon: <User className="w-6 h-6" /> },
  { id: "system", name: "System", icon: <RotateCcw className="w-6 h-6" /> },
  { id: "developer", name: "Developer Mode", icon: <Code className="w-6 h-6" /> },
  { id: "about", name: "About", icon: <Info className="w-6 h-6" /> },
];

export function Settings({ onBack, isStoreMode }: SettingsProps) {
  const [activeSection, setActiveSection] = useState("voice");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [speechRate, setSpeechRate] = useState([50]);
  const [microphoneStatus, setMicrophoneStatus] = useState("ready");
  const [isTesting, setIsTesting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem("theme") || "default");
  const [developerMode, setDeveloperMode] = useState(localStorage.getItem("developerMode") === "true");
  const [customWakeWord, setCustomWakeWord] = useState(localStorage.getItem("customWakeWord") || "Hey, Sagi");

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
                    Respond to custom wake word
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
                <Label htmlFor="custom-wake-word">Custom Wake Word</Label>
                <Input
                  id="custom-wake-word"
                  type="text"
                  placeholder="e.g., Hey, Sagi"
                  value={customWakeWord}
                  onChange={(e) => {
                    const newWakeWord = e.target.value;
                    setCustomWakeWord(newWakeWord);
                    localStorage.setItem("customWakeWord", newWakeWord);
                  }}
                  disabled={!voiceEnabled || !wakeWordEnabled}
                  data-testid="input-wake-word"
                />
                <p className="text-xs text-muted-foreground">
                  Change the wake word to activate the assistant (minimum 2 words recommended)
                </p>
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
                <p>"Open notes" - Launch notes app</p>
                <p>"Open weather" - Check the weather</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "weather" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">Weather Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure weather service and location
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="weather-provider">Weather Provider</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Choose your weather data source
                </p>
                <select
                  id="weather-provider"
                  defaultValue={localStorage.getItem("weatherProvider") || "mock"}
                  onChange={(e) => localStorage.setItem("weatherProvider", e.target.value)}
                  className="w-full p-2 rounded-lg bg-card/40 border border-border/50 text-foreground text-sm"
                  data-testid="select-weather-provider"
                >
                  <option value="mock">Demo (Mock Weather)</option>
                  <option value="accuweather">AccuWeather</option>
                </select>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selected during setup
                </p>
                <input
                  type="text"
                  value={localStorage.getItem("userCountry") || "US"}
                  disabled
                  className="w-full p-2 rounded-lg bg-card/40 border border-border/50 text-foreground text-sm opacity-50"
                  data-testid="input-country-display"
                />
              </div>

              <div>
                <Label htmlFor="accuweather-key">AccuWeather API Key (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Leave blank to use demo weather
                </p>
                <input
                  type="password"
                  id="accuweather-key"
                  placeholder="Enter your AccuWeather API key"
                  defaultValue={localStorage.getItem("accuweatherKey") || ""}
                  onChange={(e) => localStorage.setItem("accuweatherKey", e.target.value)}
                  className="w-full p-2 rounded-lg bg-card/40 border border-border/50 text-foreground text-sm placeholder-muted-foreground"
                  data-testid="input-accuweather-key"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "personalization" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-medium mb-1">Personalization</h2>
              <p className="text-sm text-muted-foreground">
                Customize your SAGI OS experience
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Themes & Background</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Choose your desktop background theme
              </p>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      localStorage.setItem("theme", theme.id);
                      window.location.reload();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedTheme === theme.id
                        ? "border-primary bg-primary/20"
                        : "border-border/50 bg-card/40 hover:border-primary/50"
                    }`}
                    data-testid={`button-theme-${theme.id}`}
                  >
                    <div className={`w-full h-16 rounded-lg mb-3 ${theme.background}`} />
                    <p className="font-medium text-sm">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex gap-3">
                <Paintbrush className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Custom Themes</p>
                  <p className="text-xs text-muted-foreground">
                    More theme customization options coming soon. You'll be able to create custom color schemes and upload your own backgrounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "system" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">System</h2>
              <p className="text-sm text-muted-foreground">
                Device and OS management
              </p>
            </div>

            {!isStoreMode && (
              <div className="space-y-4">
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <h3 className="font-medium text-destructive mb-2">Reset OS</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    This will clear all settings, history, notes, and return to the initial setup. This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      if (confirm("Are you sure you want to reset SagiOS? All data will be erased.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    data-testid="button-reset-os"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Setup
                  </Button>
                </div>
              </div>
            )}

            {isStoreMode && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-sm text-muted-foreground">
                  Reset is disabled in Store Mode. To reset, please contact store management.
                </p>
              </div>
            )}
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

        {activeSection === "developer" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-lg font-medium mb-1">Developer Mode</h2>
              <p className="text-sm text-muted-foreground">
                Advanced tools for developers and testers
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dev-mode">Enable Developer Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Unlock testing tools and debug features
                  </p>
                </div>
                <Switch 
                  id="dev-mode"
                  checked={developerMode}
                  onCheckedChange={(checked) => {
                    setDeveloperMode(checked);
                    localStorage.setItem("developerMode", checked.toString());
                  }}
                  data-testid="switch-developer-mode"
                />
              </div>
            </div>

            {developerMode && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm font-medium mb-2">Active Features:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Testing Board access in app drawer</li>
                    <li>✓ Debug console logs (dev build)</li>
                    <li>✓ localStorage inspection</li>
                    <li>✓ Voice command testing</li>
                    <li>✓ App state inspection</li>
                  </ul>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    console.log("App State:", {
                      developerMode,
                      localStorage: Object.keys(localStorage),
                      timestamp: new Date().toISOString()
                    });
                    alert("App state logged to console (F12)");
                  }}
                  data-testid="button-inspect-state"
                >
                  Inspect App State
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (confirm("Clear all localStorage data?")) {
                      localStorage.clear();
                      localStorage.setItem("developerMode", "true");
                      window.location.reload();
                    }
                  }}
                  data-testid="button-clear-storage"
                >
                  Clear Storage
                </Button>
              </div>
            )}
          </div>
        )}

        {!["voice", "about", "display", "weather", "system", "personalization", "developer"].includes(activeSection) && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-lg">Settings for {sections.find(s => s.id === activeSection)?.name} coming soon</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
