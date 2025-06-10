import { DashboardPage } from "@/pages/dashboard"
import { createFileRoute } from "@tanstack/react-router"

export const dashboardRoute = createFileRoute("")({
  component: DashboardPage,
}) 