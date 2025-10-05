// XP and leveling calculations
export const calculateLevel = (totalXP: number): number => {
  // Level up every 1000 XP
  return Math.floor(totalXP / 1000) + 1;
};

export const calculateXPForNextLevel = (level: number): number => {
  return level * 1000;
};

export const calculateCurrentLevelXP = (totalXP: number, level: number): number => {
  const xpForPreviousLevel = (level - 1) * 1000;
  return totalXP - xpForPreviousLevel;
};

// XP rewards
export const XP_REWARDS = {
  TASK_COMPLETE: 50,
  HABIT_COMPLETE: 30,
  NOTE_CREATE: 10,
  DAILY_LOGIN: 20,
  STREAK_BONUS: 25,
} as const;

// Level titles
export const getLevelTitle = (level: number): string => {
  if (level < 5) return "Rookie Planner";
  if (level < 10) return "Task Apprentice";
  if (level < 20) return "Habit Builder";
  if (level < 30) return "Productivity Pro";
  if (level < 50) return "Master Organizer";
  return "Legendary Achiever";
};

// Character types
export const CHARACTER_TYPES = [
  { id: "warrior", name: "Warrior", emoji: "⚔️", description: "Conquer tasks head-on" },
  { id: "mage", name: "Mage", emoji: "🧙‍♂️", description: "Master knowledge & wisdom" },
  { id: "ranger", name: "Ranger", emoji: "🏹", description: "Precise and focused" },
  { id: "scholar", name: "Scholar", emoji: "📚", description: "Learn and grow daily" },
  { id: "builder", name: "Builder", emoji: "🛠️", description: "Build lasting habits" },
];

// Local storage keys
export const STORAGE_KEYS = {
  TASKS: "questflow_tasks",
  HABITS: "questflow_habits",
  NOTES: "questflow_notes",
  PLAYER: "questflow_player",
} as const;

// Player data interface
export interface PlayerData {
  totalXP: number;
  level: number;
  characterType: string;
  username: string;
  createdAt: string;
}

// Initialize or get player data
export const getPlayerData = (): PlayerData => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYER);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newPlayer: PlayerData = {
    totalXP: 0,
    level: 1,
    characterType: "warrior",
    username: "Player",
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(newPlayer));
  return newPlayer;
};

// Update player XP
export const addXP = (amount: number): PlayerData => {
  const player = getPlayerData();
  player.totalXP += amount;
  player.level = calculateLevel(player.totalXP);
  localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player));
  return player;
};
