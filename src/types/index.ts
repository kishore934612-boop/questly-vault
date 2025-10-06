export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  recurring?: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    endDate?: string;
  };
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly";
  streak: number;
  lastCompleted: string | null;
  completions: string[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
