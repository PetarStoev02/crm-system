import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { LifecyclePage } from "@/pages/lifecycle"

export const lifecycleRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "lifecycle",
  component: LifecyclePage,
}) 