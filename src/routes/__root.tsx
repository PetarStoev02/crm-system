import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-w-[100vw] min-h-[100vh] overflow-hidden">
        <AppSidebar className="h-screen overflow-y-auto" />
        <main className="flex-1 w-full bg-background h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </SidebarProvider>
  ),
})