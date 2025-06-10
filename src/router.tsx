import { createRouter } from "@tanstack/react-router"
import { rootRoute } from "./routes/__root"
import { dashboardRoute } from "./routes/_authed/dashboard"
import { leadsRoute } from "./routes/_authed/leads"
import { campaignsRoute } from "./routes/_authed/campaigns"
import { tasksRoute } from "./routes/_authed/tasks"
import { clientsRoute } from "./routes/_authed/clients"
import { communicationRoute } from "./routes/_authed/communication"
import { reportsRoute } from "./routes/_authed/reports"

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  leadsRoute,
  campaignsRoute,
  tasksRoute,
  clientsRoute,
  communicationRoute,
  reportsRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
} 