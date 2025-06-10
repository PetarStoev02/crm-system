import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { SettingsPage } from "@/pages/settings"

export const settingsRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "settings",
  component: SettingsPage,
}) 