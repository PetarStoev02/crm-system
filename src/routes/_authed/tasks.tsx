import { createFileRoute } from "@tanstack/react-router"
import { TasksPage } from "@/pages/tasks"

export const tasksRoute = createFileRoute("/tasks")({
  component: TasksPage,
}) 