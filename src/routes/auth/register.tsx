import { createRoute } from "@tanstack/react-router"
import { authRoute } from "../auth"
import { RegisterPage } from "@/pages/auth/register"

export const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "register",
  component: RegisterPage,
}) 