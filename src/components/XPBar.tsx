import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export default function XPBar({ currentXP, maxXP, level }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-xp" />
          <span className="font-medium text-foreground">Level {level}</span>
        </div>
        <span className="text-muted-foreground">
          {currentXP} / {maxXP} XP
        </span>
      </div>
      <Progress value={percentage} className="h-3 bg-muted" />
    </div>
  );
}
