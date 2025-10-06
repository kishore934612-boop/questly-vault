import { useState, useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import Layout from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STORAGE_KEYS } from "@/lib/gameLogic";
import type { Task, Habit } from "@/types";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
    return stored ? JSON.parse(stored) : [];
  });

  // Get items for selected date
  const selectedDateItems = useMemo(() => {
    const tasksForDate = tasks.filter(task => 
      task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate)
    );
    const habitsForDate = habits.filter(habit => {
      if (habit.frequency === "daily") return true;
      if (habit.completions.some(date => isSameDay(parseISO(date), selectedDate))) {
        return true;
      }
      return false;
    });
    return { tasks: tasksForDate, habits: habitsForDate };
  }, [selectedDate, tasks, habits]);

  // Get dates with items
  const datesWithItems = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach(task => {
      if (task.dueDate) dates.add(format(parseISO(task.dueDate), "yyyy-MM-dd"));
    });
    habits.forEach(habit => {
      habit.completions.forEach(date => {
        dates.add(format(parseISO(date), "yyyy-MM-dd"));
      });
    });
    return dates;
  }, [tasks, habits]);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <CalendarIcon className="w-10 h-10" />
            Calendar
          </h1>
          <p className="text-muted-foreground">View your tasks and habits by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border mx-auto"
                modifiers={{
                  hasItems: (date) => datesWithItems.has(format(date, "yyyy-MM-dd"))
                }}
                modifiersClassNames={{
                  hasItems: "bg-primary/20 font-bold"
                }}
              />
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tasks */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  Tasks
                  <Badge variant="secondary">{selectedDateItems.tasks.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {selectedDateItems.tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tasks for this day</p>
                  ) : (
                    selectedDateItems.tasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            )}
                          </div>
                          <Badge variant={
                            task.priority === "high" ? "destructive" :
                            task.priority === "medium" ? "default" : "secondary"
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Habits */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  Habits
                  <Badge variant="secondary">{selectedDateItems.habits.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {selectedDateItems.habits.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No habits for this day</p>
                  ) : (
                    selectedDateItems.habits.map(habit => {
                      const completedOnDate = habit.completions.some(date => 
                        isSameDay(parseISO(date), selectedDate)
                      );
                      return (
                        <div
                          key={habit.id}
                          className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${completedOnDate ? "line-through text-muted-foreground" : ""}`}>
                                {habit.title}
                              </p>
                              {habit.description && (
                                <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                              )}
                            </div>
                            <Badge variant={completedOnDate ? "default" : "outline"}>
                              {completedOnDate ? "✓ Done" : habit.frequency}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
