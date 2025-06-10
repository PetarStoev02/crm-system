import { createFileRoute } from "@tanstack/react-router"
import { LeadsPage } from "@/pages/leads"

export const leadsRoute = createFileRoute("/leads")({
  component: LeadsPage,
}) 