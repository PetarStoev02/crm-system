import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { ProfilePage } from "@/pages/profile"

export const profileRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "profile",
  component: ProfilePage,
}) 