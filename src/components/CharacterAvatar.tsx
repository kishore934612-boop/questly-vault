import { Crown } from "lucide-react";

interface CharacterAvatarProps {
  level: number;
  characterType?: string;
}

export default function CharacterAvatar({ level, characterType = "warrior" }: CharacterAvatarProps) {
  // Character emoji based on type
  const characters: Record<string, string> = {
    warrior: "⚔️",
    mage: "🧙‍♂️",
    ranger: "🏹",
    scholar: "📚",
    builder: "🛠️",
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-2xl bg-gradient-primary flex items-center justify-center text-6xl shadow-glow animate-pulse-glow">
        {characters[characterType] || characters.warrior}
      </div>
      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-xp border-4 border-background flex items-center justify-center shadow-elevated">
        <Crown className="w-5 h-5 text-background" />
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-level text-xs font-bold text-white shadow-elevated">
        Lvl {level}
      </div>
    </div>
  );
}
