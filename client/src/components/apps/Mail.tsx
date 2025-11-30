import { Mail as MailIcon, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MailAppProps {
  onBack: () => void;
}

const mailProviders = [
  { id: "gmail", name: "Gmail", url: "https://mail.google.com" },
  { id: "outlook", name: "Outlook", url: "https://outlook.live.com" },
  { id: "aol", name: "AOL Mail", url: "https://mail.aol.com" },
  { id: "yahoo", name: "Yahoo Mail", url: "https://mail.yahoo.com" },
  { id: "protonmail", name: "ProtonMail", url: "https://mail.proton.me" },
];

export function Mail({ onBack }: MailAppProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(() => {
    return localStorage.getItem("mailProvider") || null;
  });

  const emails = [
    { from: "John Doe", subject: "Project Update", date: "2 min ago", unread: true },
    { from: "Sarah Smith", subject: "Meeting Tomorrow", date: "1 hour ago", unread: true },
    { from: "Team Lead", subject: "Weekly Report", date: "3 hours ago", unread: false },
    { from: "HR Department", subject: "Benefits Renewal", date: "Yesterday", unread: false },
  ];

  const handleSelectProvider = (providerId: string) => {
    localStorage.setItem("mailProvider", providerId);
    setSelectedProvider(providerId);
  };

  const currentProvider = mailProviders.find(p => p.id === selectedProvider);

  if (!selectedProvider) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
        <div className="flex items-center gap-4 px-6 mb-6">
          <MailIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Mail</h1>
        </div>

        <div className="flex-1 px-6 pb-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Email Provider</h2>
          <div className="w-full max-w-sm space-y-3">
            {mailProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="secondary"
                className="w-full h-14 text-lg"
                onClick={() => {
                  handleSelectProvider(provider.id);
                  window.location.href = `/api/proxy?url=${encodeURIComponent(provider.url)}`;
                }}
                data-testid={`button-provider-${provider.id}`}
              >
                {provider.name}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-4">
          <MailIcon className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Mail</h1>
            <p className="text-sm text-muted-foreground">{currentProvider?.name}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("mailProvider");
            setSelectedProvider(null);
          }}
          data-testid="button-change-provider"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-2">
          {emails.map((email, idx) => (
            <div key={idx} className={`p-4 rounded-xl border border-border/50 hover-elevate cursor-pointer ${email.unread ? "bg-primary/10" : "bg-card/40"}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${email.unread ? "text-white" : ""}`}>{email.from}</p>
                  <p className="text-sm text-muted-foreground">{email.subject}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{email.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
