import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Flame, Check, Trash2 } from "lucide-react";
import { Habit } from "@/types";
import { STORAGE_KEYS, addXP, XP_REWARDS } from "@/lib/gameLogic";
import { toast } from "sonner";

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    frequency: "daily" as Habit["frequency"],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  const saveHabits = (updatedHabits: Habit[]) => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  };

  const handleAddHabit = () => {
    if (!newHabit.title.trim()) {
      toast.error("Habit title is required!");
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      ...newHabit,
      streak: 0,
      lastCompleted: null,
      completions: [],
      createdAt: new Date().toISOString(),
    };

    saveHabits([...habits, habit]);
    setNewHabit({ title: "", description: "", frequency: "daily" });
    setIsAdding(false);
    toast.success("Habit created! Start your streak!");
  };

  const completeHabit = (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const lastDate = habit.lastCompleted?.split("T")[0];
        if (lastDate === today) {
          toast.info("Already completed today!");
          return habit;
        }

        const isConsecutive = lastDate === new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const newStreak = isConsecutive ? habit.streak + 1 : 1;
        
        const xpGained = XP_REWARDS.HABIT_COMPLETE + (newStreak > 7 ? XP_REWARDS.STREAK_BONUS : 0);
        addXP(xpGained);
        
        toast.success(`Habit completed! +${xpGained} XP 🔥`, {
          description: newStreak > 1 ? `${newStreak} day streak!` : undefined,
        });

        return {
          ...habit,
          streak: newStreak,
          lastCompleted: new Date().toISOString(),
          completions: [...habit.completions, today],
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
    toast.info("Habit deleted");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Habits</h1>
            <p className="text-muted-foreground">Build streaks and level up your routine</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>

        {/* Add Habit Form */}
        {isAdding && (
          <Card className="p-6 bg-gradient-card border-border shadow-card animate-scale-in">
            <h3 className="text-lg font-semibold mb-4">Create New Habit</h3>
            <div className="space-y-4">
              <Input
                placeholder="Habit title (e.g., Morning workout)"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              />
              <Textarea
                placeholder="Why is this important to you?"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddHabit} className="flex-1 bg-success hover:bg-success/90">
                  Start Habit
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.length === 0 ? (
            <Card className="col-span-2 p-12 text-center bg-gradient-card border-border">
              <p className="text-muted-foreground">No habits yet. Create one to start your journey!</p>
            </Card>
          ) : (
            habits.map((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const completedToday = habit.lastCompleted?.split("T")[0] === today;

              return (
                <Card
                  key={habit.id}
                  className="p-6 bg-gradient-card border-border shadow-card hover:shadow-elevated transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{habit.title}</h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Streak Display */}
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-5 h-5 text-streak" />
                    <span className="text-2xl font-bold text-streak">{habit.streak}</span>
                    <span className="text-sm text-muted-foreground">day streak</span>
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={() => completeHabit(habit.id)}
                    disabled={completedToday}
                    className={`w-full ${
                      completedToday
                        ? "bg-success text-white cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {completedToday ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Completed Today
                      </>
                    ) : (
                      "Complete Today"
                    )}
                  </Button>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
