import { createRoute } from "@tanstack/react-router"
import { authRoute } from "../auth"
import { LoginPage } from "@/pages/auth/login"

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "login",
  component: LoginPage,
}) 