import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/leads" className="[&.active]:font-bold">
          Leads
        </Link>
        <Link to="/campaigns" className="[&.active]:font-bold">
          Campaigns
        </Link>
        <Link to="/tasks" className="[&.active]:font-bold">
          Tasks
        </Link>
        <Link to="/clients" className="[&.active]:font-bold">
          Clients
        </Link>
        <Link to="/communication" className="[&.active]:font-bold">
          Communication
        </Link>
        <Link to="/reports" className="[&.active]:font-bold">
          Reports
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})