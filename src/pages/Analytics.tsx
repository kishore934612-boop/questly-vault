import { useState, useEffect, useMemo } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval } from "date-fns";
import { BarChart3, TrendingUp, Calendar as CalendarIcon, Award } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STORAGE_KEYS } from "@/lib/gameLogic";
import type { Task, Habit } from "@/types";

export default function Analytics() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : [];
  });

  const weeklyStats = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const completedTasks = tasks.filter(task => 
      task.completed && task.createdAt && 
      isWithinInterval(parseISO(task.createdAt), { start: weekStart, end: weekEnd })
    ).length;

    const habitCompletions = habits.reduce((acc, habit) => {
      return acc + habit.completions.filter(date => 
        isWithinInterval(parseISO(date), { start: weekStart, end: weekEnd })
      ).length;
    }, 0);

    const activeStreaks = habits.filter(h => h.streak > 0).length;

    return { completedTasks, habitCompletions, activeStreaks };
  }, [tasks, habits]);

  const monthlyStats = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    const completedTasks = tasks.filter(task => 
      task.completed && task.createdAt && 
      isWithinInterval(parseISO(task.createdAt), { start: monthStart, end: monthEnd })
    ).length;

    const habitCompletions = habits.reduce((acc, habit) => {
      return acc + habit.completions.filter(date => 
        isWithinInterval(parseISO(date), { start: monthStart, end: monthEnd })
      ).length;
    }, 0);

    const avgStreak = habits.length > 0 
      ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length)
      : 0;

    return { completedTasks, habitCompletions, avgStreak };
  }, [tasks, habits]);

  const last7Days = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return days.map(day => {
      const dayTasks = tasks.filter(task => 
        task.completed && task.createdAt &&
        format(parseISO(task.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      ).length;

      const dayHabits = habits.reduce((acc, habit) => {
        return acc + habit.completions.filter(date => 
          format(parseISO(date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        ).length;
      }, 0);

      return {
        date: format(day, "EEE"),
        tasks: dayTasks,
        habits: dayHabits,
        total: dayTasks + dayHabits
      };
    });
  }, [tasks, habits]);

  const categoryStats = useMemo(() => {
    const categories = new Map<string, number>();
    tasks.forEach(task => {
      if (task.completed && task.category) {
        categories.set(task.category, (categories.get(task.category) || 0) + 1);
      }
    });
    return Array.from(categories.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [tasks]);

  const maxValue = Math.max(...last7Days.map(d => d.total), 1);

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your productivity journey</p>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Tasks Completed</CardDescription>
                  <CardTitle className="text-3xl text-success">{weeklyStats.completedTasks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Habit Check-ins</CardDescription>
                  <CardTitle className="text-3xl text-primary">{weeklyStats.habitCompletions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Active Streaks</CardDescription>
                  <CardTitle className="text-3xl text-streak-fire">{weeklyStats.activeStreaks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Keep going!</p>
                </CardContent>
              </Card>
            </div>

            {/* 7 Day Chart */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Last 7 Days Activity</CardTitle>
                <CardDescription>Your daily completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {last7Days.map((day, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium w-12">{day.date}</span>
                        <div className="flex-1 mx-4">
                          <div className="h-8 bg-muted rounded-full overflow-hidden relative">
                            {day.tasks > 0 && (
                              <div 
                                className="h-full bg-success absolute left-0"
                                style={{ width: `${(day.tasks / maxValue) * 100}%` }}
                              />
                            )}
                            {day.habits > 0 && (
                              <div 
                                className="h-full bg-primary absolute"
                                style={{ 
                                  left: `${(day.tasks / maxValue) * 100}%`,
                                  width: `${(day.habits / maxValue) * 100}%` 
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-foreground font-semibold w-8 text-right">{day.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 mt-6 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span className="text-sm text-muted-foreground">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="text-sm text-muted-foreground">Habits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Tasks Completed</CardDescription>
                  <CardTitle className="text-3xl text-success">{monthlyStats.completedTasks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Habit Check-ins</CardDescription>
                  <CardTitle className="text-3xl text-primary">{monthlyStats.habitCompletions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardDescription>Average Streak</CardDescription>
                  <CardTitle className="text-3xl text-accent">{monthlyStats.avgStreak}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Days</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories */}
            {categoryStats.length > 0 && (
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Your most productive areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <Award className={`w-5 h-5 ${idx === 0 ? 'text-xp-gold' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{cat.name}</span>
                            <span className="text-sm text-muted-foreground">{cat.count} tasks</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(cat.count / categoryStats[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
