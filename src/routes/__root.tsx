import { createRootRoute, Outlet } from "@tanstack/react-router"

export const rootRoute = createRootRoute({
  component: () => <div className="overflow-x-hidden"><Outlet /></div>,
}) 