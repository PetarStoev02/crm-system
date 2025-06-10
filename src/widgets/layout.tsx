import { AppSidebar } from "./app-sidebar"
import { Outlet } from "@tanstack/react-router"

export function Layout() {
  return (
    <div className="flex min-h-screen min-w-screen">
      <AppSidebar className="border-r" />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 