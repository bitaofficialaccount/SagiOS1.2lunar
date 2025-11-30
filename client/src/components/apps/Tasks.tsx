import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TasksProps {
  onBack?: () => void;
}

export function Tasks({ onBack }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("sagiTasks");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        title: "Welcome to Tasks",
        completed: false,
        createdAt: new Date(),
      },
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem("sagiTasks", JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date(),
    };
    saveTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const todoTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-tasks-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold flex-1">My Tasks</h1>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="h-12"
              autoFocus
              data-testid="input-new-task"
            />
            <Button
              onClick={addTask}
              className="h-12 px-4 rounded-lg"
              data-testid="button-add-task"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* To Do Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-muted-foreground">To Do</h2>
              <div className="space-y-2">
                {todoTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    All tasks completed!
                  </p>
                ) : (
                  todoTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover-elevate transition-colors"
                      data-testid={`task-item-${task.id}`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                        data-testid={`button-toggle-task-${task.id}`}
                      >
                        <Circle className="w-6 h-6 text-primary" />
                      </button>
                      <span className="flex-1 text-sm">{task.title}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0"
                        data-testid={`button-delete-task-${task.id}`}
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Done Section */}
            {doneTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Done</h2>
                <div className="space-y-2">
                  {doneTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 hover-elevate transition-colors"
                      data-testid={`task-done-${task.id}`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                        data-testid={`button-undo-task-${task.id}`}
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </button>
                      <span className="flex-1 text-sm line-through text-muted-foreground">
                        {task.title}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0"
                        data-testid={`button-delete-done-task-${task.id}`}
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
