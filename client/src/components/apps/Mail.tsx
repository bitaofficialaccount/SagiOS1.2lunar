import { Mail as MailIcon, ChevronRight } from "lucide-react";

interface MailAppProps {
  onBack: () => void;
}

export function Mail({ onBack }: MailAppProps) {
  const emails = [
    { from: "John Doe", subject: "Project Update", date: "2 min ago", unread: true },
    { from: "Sarah Smith", subject: "Meeting Tomorrow", date: "1 hour ago", unread: true },
    { from: "Team Lead", subject: "Weekly Report", date: "3 hours ago", unread: false },
    { from: "HR Department", subject: "Benefits Renewal", date: "Yesterday", unread: false },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <MailIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold">Mail</h1>
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
