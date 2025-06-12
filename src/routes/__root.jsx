import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// It's the layout component
export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex gap-4">
          <Link to="/" className="hover:text-gray-300 [&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/campaigns" className="hover:text-gray-300 [&.active]:font-bold">
            Campaigns
          </Link>
          <Link to="/clients" className="hover:text-gray-300 [&.active]:font-bold">
            Clients
          </Link>
          <Link to="/leads" className="hover:text-gray-300 [&.active]:font-bold">
            Leads
          </Link>
          <Link to="/tasks" className="hover:text-gray-300 [&.active]:font-bold">
            Tasks
          </Link>
          <Link to="/communication" className="hover:text-gray-300 [&.active]:font-bold">
            Communication
          </Link>
          <Link to="/reports" className="hover:text-gray-300 [&.active]:font-bold">
            Reports
          </Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
