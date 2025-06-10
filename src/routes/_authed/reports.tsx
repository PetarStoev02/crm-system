import { createFileRoute } from "@tanstack/react-router"
import { ReportsPage } from "@/pages/reports"

export const reportsRoute = createFileRoute("/reports")({
  component: ReportsPage,
}) 