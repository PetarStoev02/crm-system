import { createFileRoute } from "@tanstack/react-router"
import { ClientsPage } from "@/pages/clients"

export const clientsRoute = createFileRoute("/clients")({
  component: ClientsPage,
}) 