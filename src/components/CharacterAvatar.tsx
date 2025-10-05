import { Crown } from "lucide-react";

interface CharacterAvatarProps {
  level: number;
  characterType?: string;
  size?: "sm" | "md" | "lg";
}

export default function CharacterAvatar({ level, characterType = "warrior", size = "lg" }: CharacterAvatarProps) {
  // Character emoji based on type
  const characters: Record<string, string> = {
    warrior: "⚔️",
    mage: "🧙‍♂️",
    ranger: "🏹",
    scholar: "📚",
    builder: "🛠️",
  };

  const sizeClasses = {
    sm: "w-16 h-16 text-3xl",
    md: "w-24 h-24 text-5xl",
    lg: "w-32 h-32 text-6xl",
  };

  const crownSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow`}>
        {characters[characterType] || characters.warrior}
      </div>
      <div className={`absolute -top-2 -right-2 ${crownSizes[size]} rounded-full bg-xp border-4 border-background flex items-center justify-center shadow-elevated`}>
        <Crown className={`${iconSizes[size]} text-background`} />
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-level text-xs font-bold text-white shadow-elevated">
        Lvl {level}
      </div>
    </div>
  );
}
