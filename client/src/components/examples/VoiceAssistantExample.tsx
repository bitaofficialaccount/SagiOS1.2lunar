import { VoiceAssistant } from "../os/VoiceAssistant";

export default function VoiceAssistantExample() {
  return (
    <div className="flex items-center justify-center min-h-[300px] bg-background">
      <VoiceAssistant 
        onCommand={(cmd) => console.log("Voice command:", cmd)}
        onStateChange={(state) => console.log("Voice state:", state)}
      />
    </div>
  );
}
