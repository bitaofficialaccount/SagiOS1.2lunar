import { useState } from "react";
import { Globe, MessageCircle, Volume2, User, ChevronRight, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const playPronunciation = (text: string = "Hey S-A-G-I") => {
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;
  synth.speak(utterance);
};

interface SetupProps {
  onComplete: () => void;
  onTestingMode?: (username: string) => void;
  onStoreMode?: (username: string) => void;
}

export function Setup({ onComplete, onTestingMode, onStoreMode }: SetupProps) {
  const [step, setStep] = useState<"welcome" | "pronunciation" | "sagi-id" | "country" | "language" | "app-providers" | "microphone" | "complete">("welcome");
  const [customPronunciation, setCustomPronunciation] = useState(localStorage.getItem("sagiPronunciation") || "Hey S-A-G-I");
  const [sagiIdMode, setSagiIdMode] = useState<"create" | "login">("create");
  const [sagiId, setSagiId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedProviders, setSelectedProviders] = useState<{ [key: string]: string | null }>({
    mail: null,
    video: null,
    books: null,
    photos: null,
  });
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const generateRandomUsername = () => {
    const adjectives = ["Happy", "Swift", "Clever", "Bold", "Bright", "Calm", "Dynamic", "Eager"];
    const nouns = ["Panda", "Eagle", "Tiger", "Wolf", "Phoenix", "Dragon", "Falcon", "Lion"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 999);
    return `${adj}${noun}${num}`;
  };

  const isUsernameAvailable = (name: string) => {
    const savedUsers = JSON.parse(localStorage.getItem("sagiUsers") || "{}");
    return !savedUsers[name];
  };

  const handleCreateAccount = () => {
    if (!isUsernameAvailable(username)) {
      setUsernameError("Username already taken. Try another!");
      return;
    }
    setUsernameError("");

    // Save credentials
    const savedUsers = JSON.parse(localStorage.getItem("sagiUsers") || "{}");
    savedUsers[username] = { password };
    localStorage.setItem("sagiUsers", JSON.stringify(savedUsers));
    localStorage.setItem("currentUser", username);

    setStep("country");
  };

  const handleLogin = () => {
    // Check for testing credentials
    if (username === "SAGI_OFFICIAL_TESTING_ID" && password === "sagi123") {
      localStorage.setItem("currentUser", username);
      localStorage.setItem("isTestingMode", "true");
      onTestingMode?.(username);
      return;
    }

    // Check for store mode credentials
    if (username === "SAGI_RETAILMODE" && password === "retail553") {
      localStorage.setItem("currentUser", username);
      localStorage.setItem("storeMode", "true");
      onStoreMode?.(username);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("sagiUsers") || "{}");
    if (!savedUsers[username] || savedUsers[username].password !== password) {
      setUsernameError("Invalid username or password!");
      return;
    }
    setUsernameError("");
    localStorage.setItem("currentUser", username);
    setStep("country");
  };

  const handleMicrophoneTest = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneGranted(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "IN", name: "India", flag: "🇮🇳" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
  ];

  const appProviders = [
    {
      id: "mail",
      name: "Mail",
      options: [
        { id: "gmail", name: "Gmail" },
        { id: "outlook", name: "Outlook" },
        { id: "aol", name: "AOL Mail" },
        { id: "yahoo", name: "Yahoo Mail" },
      ],
    },
    {
      id: "video",
      name: "Videos",
      options: [
        { id: "youtube", name: "YouTube" },
        { id: "netflix", name: "Netflix" },
        { id: "prime", name: "Amazon Prime Video" },
      ],
    },
    {
      id: "books",
      name: "Books",
      options: [
        { id: "kindle", name: "Amazon Kindle" },
        { id: "apple", name: "Apple Books" },
        { id: "google", name: "Google Play Books" },
      ],
    },
    {
      id: "photos",
      name: "Photos",
      options: [
        { id: "google", name: "Google Photos" },
        { id: "microsoft", name: "OneDrive" },
        { id: "icloud", name: "iCloud" },
      ],
    },
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

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 text-lg rounded-full"
                onClick={() => setStep("pronunciation")}
                data-testid="button-setup-start"
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Pronunciation Step */}
        {step === "pronunciation" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">How to Say "Sagi"</h2>
              <p className="text-muted-foreground">Learn the correct pronunciation</p>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 space-y-4">
              <Button
                onClick={() => playPronunciation(customPronunciation)}
                variant="outline"
                className="w-full gap-2 rounded-lg h-12"
                data-testid="button-play-pronunciation"
              >
                <Volume2 className="w-5 h-5" />
                Play Pronunciation
              </Button>
              <p className="text-sm text-muted-foreground text-center">{customPronunciation}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Customize Pronunciation</label>
              <Input
                value={customPronunciation}
                onChange={(e) => setCustomPronunciation(e.target.value)}
                placeholder="e.g., Hey S-A-G-I"
                className="rounded-lg h-12"
                data-testid="input-pronunciation"
              />
              <p className="text-xs text-muted-foreground">How you want to say it (this will be used for wake word)</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("welcome")}
                data-testid="button-back-pronunciation"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => {
                  localStorage.setItem("sagiPronunciation", customPronunciation);
                  setStep("sagi-id");
                }}
                data-testid="button-next-pronunciation"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* SAGI ID Step */}
        {step === "sagi-id" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">{sagiIdMode === "create" ? "Create Your SAGI ID" : "Sign In"}</h2>
              <p className="text-muted-foreground">{sagiIdMode === "create" ? "Your unique identifier for this device" : "Access your existing account"}</p>
            </div>

            <div className="flex gap-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-1">
              <Button
                variant={sagiIdMode === "create" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-10"
                onClick={() => {
                  setSagiIdMode("create");
                  setSagiId("");
                  setUsername("");
                  setPassword("");
                }}
                data-testid="button-mode-create"
              >
                Create
              </Button>
              <Button
                variant={sagiIdMode === "login" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-10"
                onClick={() => {
                  setSagiIdMode("login");
                  setSagiId("");
                  setUsername("");
                  setPassword("");
                }}
                data-testid="button-mode-login"
              >
                Login
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-card/40 backdrop-blur-md border border-border/50">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    placeholder="Enter your username"
                    className="border-0 bg-transparent text-base flex-1"
                    data-testid="input-username"
                  />
                  {sagiIdMode === "create" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => setUsername(generateRandomUsername())}
                      data-testid="button-random-username"
                      title="Generate random username"
                    >
                      <Dices className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {usernameError && (
                  <p className="text-xs text-red-400">{usernameError}</p>
                )}
                {sagiIdMode === "create" && (
                  <p className="text-xs text-muted-foreground">Must be unique and 3+ characters</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-card/40 backdrop-blur-md border border-border/50">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    className="border-0 bg-transparent text-base"
                    data-testid="input-password"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("welcome")}
                data-testid="button-back-sagi-id"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={sagiIdMode === "create" ? handleCreateAccount : handleLogin}
                disabled={username.length < 3 || password.length < 3}
                data-testid="button-next-sagi-id"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Country Step */}
        {step === "country" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Select Your Country</h2>
              <p className="text-muted-foreground">For weather and regional settings</p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className={`p-3 rounded-xl text-left font-medium transition-all ${
                    selectedCountry === country.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/40 backdrop-blur-md border border-border/50 hover-elevate"
                  }`}
                  onClick={() => setSelectedCountry(country.code)}
                  data-testid={`button-country-${country.code}`}
                >
                  <span className="text-xl mr-2">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("sagi-id")}
                data-testid="button-back-country"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("language")}
                data-testid="button-next-country"
              >
                Next
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
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("country")}
                data-testid="button-back-language"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => setStep("app-providers")}
                data-testid="button-next-language"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* App Providers Step */}
        {step === "app-providers" && (
          <div className="flex flex-col h-screen space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Connect Your Accounts</h2>
              <p className="text-muted-foreground">Choose your preferred provider for each app (optional)</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {appProviders.map((app) => (
                <div key={app.id} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4">
                  <p className="font-semibold mb-3">{app.name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {app.options.map((option) => (
                      <button
                        key={option.id}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedProviders[app.id] === option.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 hover-elevate"
                        }`}
                        onClick={() =>
                          setSelectedProviders({
                            ...selectedProviders,
                            [app.id]: selectedProviders[app.id] === option.id ? null : option.id,
                          })
                        }
                        data-testid={`button-provider-${app.id}-${option.id}`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">You can set this up later in Apps or Settings</p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 rounded-full"
                  onClick={() => setStep("microphone")}
                  data-testid="button-skip-providers"
                >
                  Skip
                </Button>
                <Button
                  size="lg"
                  className="flex-1 h-12 rounded-full"
                  onClick={() => setStep("microphone")}
                  data-testid="button-next-providers"
                >
                  Next
                </Button>
              </div>
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
                onClick={() => setStep("app-providers")}
                data-testid="button-back-mic"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 rounded-full"
                onClick={() => {
                  localStorage.setItem("sagiId", sagiId);
                  localStorage.setItem("userCountry", selectedCountry);
                  localStorage.setItem("userLanguage", selectedLanguage);
                  
                  // Save selected providers
                  Object.entries(selectedProviders).forEach(([app, provider]) => {
                    if (provider) {
                      if (app === "mail") localStorage.setItem("mailProvider", provider);
                      if (app === "video") localStorage.setItem("videoProvider", provider);
                      if (app === "books") localStorage.setItem("booksProvider", provider);
                      if (app === "photos") localStorage.setItem("photosProvider", provider);
                    }
                  });
                  
                  setStep("complete");
                }}
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
              <p className="text-lg text-muted-foreground">
                Welcome, <span className="text-primary font-semibold">{sagiId}</span>. You're ready to use Sagi.
              </p>
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
