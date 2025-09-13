"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

interface Todo {
  id: string
  task: string
  is_completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data.data))
  }, [])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const tempId = crypto.randomUUID()
    const optimisticTodo: Todo = {
      id: tempId,
      task: newTask,
      is_completed: false,
    }

    setTodos([optimisticTodo, ...todos])
    setNewTask("")

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      })

      if (!res.ok) {
        throw new Error("Failed to add task")
      }

      const { data: newTodo } = await res.json()
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === tempId ? newTodo : todo))
      )
    } catch (error) {
      console.error("Failed to add task:", error)
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== tempId)
      )
      // Optionally, show an error message to the user
    }
  }

  const handleToggleTodo = async (id: string, is_completed: boolean) => {
    const originalTodos = [...todos]
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, is_completed: !is_completed } : todo
      )
    )

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !is_completed }),
      })

      if (!res.ok) {
        throw new Error("Failed to toggle task")
      }
    } catch (error) {
      console.error("Failed to toggle task:", error)
      setTodos(originalTodos)
      // Optionally, show an error message to the user
    }
  }

  const handleDeleteTodo = async (id: string) => {
    const originalTodos = [...todos]
    setTodos(todos.filter((todo) => todo.id !== id))

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
      setTodos(originalTodos)
      // Optionally, show an error message to the user
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={todo.is_completed}
                  onCheckedChange={() =>
                    handleToggleTodo(todo.id, todo.is_completed)
                  }
                />
                <span
                  className={
                    todo.is_completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {todo.task}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
