import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/gameLogic";
import { Task } from "@/types";
import { format, isSameDay } from "date-fns";
import { CheckSquare, AlertCircle } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPending, setShowPending] = useState(true);
  
  const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const matchesDate = isSameDay(taskDate, selectedDate);
      const matchesFilter = 
        (showCompleted && task.completed) || 
        (showPending && !task.completed);
      
      return matchesDate && matchesFilter;
    });
  }, [selectedDate, tasks, showCompleted, showPending]);

  const datesWithTasks = useMemo(() => {
    return tasks.map(task => new Date(task.dueDate));
  }, [tasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-muted-foreground mt-2">
            View your tasks in a calendar format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-border"
                modifiers={{
                  hasTasks: datesWithTasks,
                }}
                modifiersStyles={{
                  hasTasks: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "hsl(263 70% 50%)",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Task Details */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle>
                Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                  <Label htmlFor="show-completed" className="text-sm">
                    Show Completed
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-pending"
                    checked={showPending}
                    onCheckedChange={setShowPending}
                  />
                  <Label htmlFor="show-pending" className="text-sm">
                    Show Pending
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks for this date
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-card transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {task.completed ? (
                              <CheckSquare className="w-5 h-5 text-success" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-primary" />
                            )}
                            <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground pl-7">
                              {task.description}
                            </p>
                          )}
                          <div className="flex gap-2 pl-7">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.category && (
                              <Badge variant="outline">{task.category}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
