import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, Trash2, Calendar, Pencil } from "lucide-react";
import { Task } from "@/types";
import { STORAGE_KEYS, addXP, XP_REWARDS } from "@/lib/gameLogic";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    category: "",
    dueDate: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required!");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveTasks([...tasks, task]);
    setNewTask({ title: "", description: "", priority: "medium", category: "", dueDate: "" });
    setIsAdding(false);
    toast.success("Task created! +10 XP");
    addXP(10);
  };

  const toggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        if (!task.completed) {
          addXP(XP_REWARDS.TASK_COMPLETE);
          toast.success(`Task completed! +${XP_REWARDS.TASK_COMPLETE} XP`, {
            icon: "✨",
          });
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    toast.info("Task deleted");
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast.error("Task title is required!");
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? editingTask : task
    );
    saveTasks(updatedTasks);
    setEditingTask(null);
    toast.success("Task updated successfully");
  };

  const priorityColors = {
    low: "border-l-4 border-l-muted-foreground",
    medium: "border-l-4 border-l-secondary",
    high: "border-l-4 border-l-destructive",
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage your to-do list and earn XP</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Add Task Form */}
        {isAdding && (
          <Card className="p-6 bg-gradient-card border-border shadow-card animate-scale-in">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task["priority"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <Input
                placeholder="Category (e.g., Work, Personal)"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddTask} className="flex-1 bg-success hover:bg-success/90">
                  Add Task
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card border-border">
              <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 bg-gradient-card border-border shadow-card hover:shadow-elevated transition-all duration-200 ${
                  priorityColors[task.priority]
                } ${task.completed ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-success border-success text-white"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {task.category && <span className="px-2 py-1 bg-muted rounded">#{task.category}</span>}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="capitalize">{task.priority} priority</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(task)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={editingTask?.title || ""}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, title: e.target.value } : null)}
              />
              <Textarea
                placeholder="Description"
                value={editingTask?.description || ""}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, description: e.target.value } : null)}
              />
              <Select
                value={editingTask?.priority || "medium"}
                onValueChange={(value: Task["priority"]) =>
                  setEditingTask(editingTask ? { ...editingTask, priority: value } : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Category"
                value={editingTask?.category || ""}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, category: e.target.value } : null)}
              />
              <Input
                type="date"
                value={editingTask?.dueDate || ""}
                onChange={(e) => setEditingTask(editingTask ? { ...editingTask, dueDate: e.target.value } : null)}
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdateTask} className="flex-1">
                  Update Task
                </Button>
                <Button variant="outline" onClick={() => setEditingTask(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
