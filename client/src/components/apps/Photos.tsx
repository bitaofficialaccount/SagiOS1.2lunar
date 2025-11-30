import { ArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotosProps {
  onBack: () => void;
}

export function Photos({ onBack }: PhotosProps) {
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full"
          onClick={onBack}
          data-testid="button-back-photos"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold">Photos</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <Image className="w-24 h-24 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">No photos yet</h2>
          <p className="text-muted-foreground">Your photos will appear here</p>
        </div>
      </div>
    </div>
  );
}
