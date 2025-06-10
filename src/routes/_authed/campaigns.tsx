import { createFileRoute } from "@tanstack/react-router"
import { CampaignsPage } from "@/pages/campaigns"

export const campaignsRoute = createFileRoute("/campaigns")({
  component: CampaignsPage,
}) 