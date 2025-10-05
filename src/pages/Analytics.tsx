import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckSquare, Target, TrendingUp, Flame } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/gameLogic";
import { Task, Habit } from "@/types";
import { useMemo } from "react";
import StatCard from "@/components/StatCard";

export default function Analytics() {
  const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
  const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || "[]");

  const taskStats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const highPriority = tasks.filter(t => t.priority === "high").length;
    
    const byPriority = [
      { name: "High", value: tasks.filter(t => t.priority === "high").length, color: "hsl(0 84.2% 60.2%)" },
      { name: "Medium", value: tasks.filter(t => t.priority === "medium").length, color: "hsl(45 100% 51%)" },
      { name: "Low", value: tasks.filter(t => t.priority === "low").length, color: "hsl(142 71% 45%)" },
    ];

    const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return { completed, pending, highPriority, byPriority, completionRate };
  }, [tasks]);

  const habitStats = useMemo(() => {
    const totalHabits = habits.length;
    const avgStreak = habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;
    const longestStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak))
      : 0;

    const streakData = habits.map(h => ({
      name: h.title.length > 15 ? h.title.substring(0, 15) + "..." : h.title,
      streak: h.streak,
    }));

    return { totalHabits, avgStreak, longestStreak, streakData };
  }, [habits]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your productivity and progress
          </p>
        </div>

        {/* Task Analytics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Task Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Completed Tasks"
              value={taskStats.completed}
              icon={CheckSquare}
              color="success"
            />
            <StatCard
              title="Pending Tasks"
              value={taskStats.pending}
              icon={CheckSquare}
              color="primary"
            />
            <StatCard
              title="Completion Rate"
              value={`${taskStats.completionRate}%`}
              icon={TrendingUp}
              color="xp"
            />
          </div>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStats.byPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStats.byPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Habit Analytics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Habit Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Habits"
              value={habitStats.totalHabits}
              icon={Target}
              color="primary"
            />
            <StatCard
              title="Average Streak"
              value={habitStats.avgStreak}
              icon={Flame}
              color="streak"
            />
            <StatCard
              title="Longest Streak"
              value={habitStats.longestStreak}
              icon={Flame}
              color="xp"
            />
          </div>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Habit Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitStats.streakData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 15%)" />
                  <XAxis dataKey="name" stroke="hsl(240 5% 64.9%)" />
                  <YAxis stroke="hsl(240 5% 64.9%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240 10% 8%)",
                      border: "1px solid hsl(240 6% 15%)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="streak" fill="hsl(15 100% 55%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
