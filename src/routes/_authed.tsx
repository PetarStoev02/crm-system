import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { SidebarProvider } from "@/shared/ui/sidebar"
import { Layout } from "@/widgets/layout"

const Authed = () => {
  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  )
}

export const authedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authed",
  component: Authed,
})
