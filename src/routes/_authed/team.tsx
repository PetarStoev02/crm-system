import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { TeamPage } from "@/pages/team"

export const teamRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "team",
  component: TeamPage,
}) 