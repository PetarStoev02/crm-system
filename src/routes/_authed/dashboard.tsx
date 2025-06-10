import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { DashboardPage } from "@/pages/dashboard"

export const dashboardRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "/",
  component: DashboardPage,
}) 