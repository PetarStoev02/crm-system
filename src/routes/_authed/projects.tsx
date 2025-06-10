import { createRoute } from "@tanstack/react-router"
import { authedRoute } from "../_authed"
import { ProjectsPage } from "@/pages/projects"

export const projectsRoute = createRoute({
  getParentRoute: () => authedRoute,
  path: "projects",
  component: ProjectsPage,
}) 