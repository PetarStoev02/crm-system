import { Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { authService } from "@/lib/auth";
import NotFoundPage from "@/pages/404";

export const Route = createFileRoute({
  beforeLoad: () => {
    if (!authService.isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: function AuthedLayout() {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-w-[100vw] min-h-[100vh] overflow-hidden">
          <AppSidebar className="h-screen overflow-y-auto" />
          <main className="flex-1 w-full bg-background h-screen overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    );
  },
  notFoundComponent: NotFoundPage,
});
