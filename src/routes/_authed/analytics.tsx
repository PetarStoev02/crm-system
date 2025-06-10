import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { AnalyticsPage } from "@/pages/analytics"

export const analyticsRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "analytics",
  component: AnalyticsPage,
}) 