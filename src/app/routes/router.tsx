import { createRouter } from "@tanstack/react-router"
import { rootRoute } from "../../routes/__root"
import { authedRoute } from "../../routes/_authed"
import { authRoute } from "../../routes/auth"
import { dashboardRoute } from "../../routes/_authed/dashboard"
import { lifecycleRoute } from "../../routes/_authed/lifecycle"
import { analyticsRoute } from "../../routes/_authed/analytics"
import { projectsRoute } from "../../routes/_authed/projects"
import { teamRoute } from "../../routes/_authed/team"
import { profileRoute } from "../../routes/_authed/profile"
import { settingsRoute } from "../../routes/_authed/settings"
import { loginRoute } from "../../routes/auth/login"
import { registerRoute } from "../../routes/auth/register"

const routeTree = rootRoute.addChildren([
  authedRoute.addChildren([
    dashboardRoute,
    lifecycleRoute,
    analyticsRoute,
    projectsRoute,
    teamRoute,
    profileRoute,
    settingsRoute,
  ]),
  authRoute.addChildren([
    loginRoute,
    registerRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
} 