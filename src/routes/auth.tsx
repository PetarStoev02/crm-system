import { createRoute, Outlet } from "@tanstack/react-router"
import { rootRoute } from "./__root"

const AuthLayout = () => {
  return <Outlet />
}

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
})
