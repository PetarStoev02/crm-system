import { createFileRoute } from "@tanstack/react-router"
import { CommunicationPage } from "@/pages/communication"

export const communicationRoute = createFileRoute("/communication")({
  component: CommunicationPage,
}) 