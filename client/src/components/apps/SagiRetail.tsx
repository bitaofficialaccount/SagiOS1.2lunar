import { AlertTriangle, Settings, Palette, Volume2, Bell, Lock, User, RotateCcw, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

interface SagiRetailProps {
  onBack: () => void;
  onOpenSettings?: () => void;
}

export function SagiRetail({ onBack, onOpenSettings }: SagiRetailProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-retail-back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold">SAGI Retail</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-2xl">
          {/* Warning Banner */}
          <div className="bg-destructive/20 border border-destructive/50 rounded-xl p-4 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Customer Notice</p>
              <p className="text-sm text-muted-foreground">
                This device is in Store Mode demonstration. Changes made to settings will persist for future customers. Please handle with care and follow store guidelines.
              </p>
            </div>
          </div>

          {/* Available Features */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <p className="font-semibold">All Settings</p>
                </div>
                <p className="text-sm text-muted-foreground">Configure voice, sound, notifications, privacy, personalization, and system preferences</p>
              </div>

              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-accent" />
                  <p className="font-semibold">Account Settings</p>
                </div>
                <p className="text-sm text-muted-foreground">Manage account preferences and personalization options</p>
              </div>

              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-5 h-5 text-blue-400" />
                  <p className="font-semibold">Themes & Display</p>
                </div>
                <p className="text-sm text-muted-foreground">Customize colors, fonts, and visual appearance</p>
              </div>

              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-5 h-5 text-purple-400" />
                  <p className="font-semibold">Audio & Voice</p>
                </div>
                <p className="text-sm text-muted-foreground">Adjust volume, speech rate, and voice assistant settings</p>
              </div>

              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <p className="font-semibold">Notifications</p>
                </div>
                <p className="text-sm text-muted-foreground">Control notification preferences and alerts</p>
              </div>

              <div className="bg-card/40 rounded-xl p-4 border border-border/50 hover-elevate">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  <p className="font-semibold">Privacy Controls</p>
                </div>
                <p className="text-sm text-muted-foreground">Manage privacy settings and permissions</p>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Quick Settings</h2>
            <div className="space-y-4 bg-card/40 rounded-xl p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Voice Assistant</label>
                <Switch defaultChecked data-testid="retail-voice-toggle" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Notifications</label>
                <Switch defaultChecked data-testid="retail-notify-toggle" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Microphone</label>
                <Switch defaultChecked data-testid="retail-mic-toggle" />
              </div>
            </div>
          </div>

          {/* Full Settings Button */}
          <Button
            className="w-full h-12 rounded-xl"
            onClick={onOpenSettings}
            data-testid="button-open-full-settings"
          >
            <Settings className="w-5 h-5 mr-2" />
            Open Full Settings
          </Button>

          {/* Info Section */}
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/30">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-2">About This Device</p>
                <p className="text-xs text-muted-foreground">
                  SAGI OS - Version 1.0 | Smart Assistant with Gesture Interface
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  For retail demonstrations only. Settings changes persist between sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
