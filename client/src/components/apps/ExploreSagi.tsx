import { Compass, Mic, Keyboard, Grid2X2, MessageCircle, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExploreSagiProps {
  onBack: () => void;
}

export function ExploreSagi({ onBack }: ExploreSagiProps) {
  const features = [
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Say 'Hey, Sagi' to activate voice control. Ask for anything - open apps, get information, or control features.",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      icon: Keyboard,
      title: "Smart Keyboard",
      description: "Full QWERTY keyboard with voice input support. Type messages or commands anywhere in the OS.",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      icon: Grid2X2,
      title: "App Drawer",
      description: "Swipe up from home screen to access all your apps. Over 12 different applications at your fingertips.",
      color: "bg-green-500/20 text-green-400"
    },
    {
      icon: MapPin,
      title: "Location & Weather",
      description: "Real-time weather updates for your location. Search different cities and see detailed forecasts.",
      color: "bg-cyan-500/20 text-cyan-400"
    },
    {
      icon: MessageCircle,
      title: "Multi-Account Support",
      description: "Connect your accounts for Mail, Photos, Videos, and Books. Create or login to manage your content.",
      color: "bg-pink-500/20 text-pink-400"
    },
    {
      icon: Settings,
      title: "Customization",
      description: "Personalize your SAGI experience with language settings, country preferences, and provider choices.",
      color: "bg-orange-500/20 text-orange-400"
    },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <Compass className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Explore SAGI</h1>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Discover What SAGI Can Do</h2>
          <p className="text-muted-foreground">Your AI-powered smart assistant with intuitive gesture controls and voice recognition</p>
        </div>

        <div className="grid gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-card/40 rounded-xl border border-border/50 p-4 hover-elevate">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-primary/10 rounded-xl border border-primary/30 p-6">
          <h3 className="font-semibold mb-3 text-lg">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Swipe down to go back from any app</li>
            <li>• Long press apps to see more options</li>
            <li>• Voice commands work from any screen</li>
            <li>• Customize providers in Setup or Settings</li>
          </ul>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Button
          className="w-full h-12 rounded-full"
          onClick={onBack}
          data-testid="button-back-explore"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
