import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import CharacterAvatar from "@/components/CharacterAvatar";
import XPBar from "@/components/XPBar";
import StatCard from "@/components/StatCard";
import { CheckSquare, Target, Flame, Trophy } from "lucide-react";
import { getPlayerData, calculateXPForNextLevel, calculateCurrentLevelXP, getLevelTitle, STORAGE_KEYS } from "@/lib/gameLogic";
import { Task, Habit } from "@/types";

export default function Dashboard() {
  const [player, setPlayer] = useState(getPlayerData());
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    activeHabits: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    // Calculate stats from localStorage
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || "[]");
    
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeHabits = habits.length;
    const longestStreak = Math.max(0, ...habits.map(h => h.streak));

    setStats({
      tasksCompleted: completedTasks,
      activeHabits,
      longestStreak,
    });
  }, []);

  const currentLevelXP = calculateCurrentLevelXP(player.totalXP, player.level);
  const maxXP = calculateXPForNextLevel(player.level);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {player.username}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              {getLevelTitle(player.level)} • Keep up the great work!
            </p>
          </div>
        </div>

        {/* Character & XP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col items-center justify-center bg-gradient-card border border-border rounded-2xl p-8 shadow-card">
            <CharacterAvatar level={player.level} characterType={player.characterType} />
            <div className="mt-6 w-full">
              <XPBar currentXP={currentLevelXP} maxXP={maxXP} level={player.level} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-xp">{player.totalXP} Total XP</p>
              <p className="text-sm text-muted-foreground mt-1">
                {maxXP - currentLevelXP} XP to Level {player.level + 1}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Tasks Completed"
              value={stats.tasksCompleted}
              icon={CheckSquare}
              color="success"
              trend="All time"
            />
            <StatCard
              title="Active Habits"
              value={stats.activeHabits}
              icon={Target}
              color="primary"
              trend="Currently tracking"
            />
            <StatCard
              title="Longest Streak"
              value={`${stats.longestStreak} days`}
              icon={Flame}
              color="streak"
              trend="Keep it going!"
            />
            <StatCard
              title="Current Level"
              value={player.level}
              icon={Trophy}
              color="xp"
              trend={getLevelTitle(player.level)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Create Task", description: "Add a new task to your list", href: "/tasks" },
              { title: "Track Habit", description: "Start building a new habit", href: "/habits" },
              { title: "Write Note", description: "Jot down your thoughts", href: "/notes" },
            ].map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="p-4 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 group"
              >
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80">
                  {action.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
