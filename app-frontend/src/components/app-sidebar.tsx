import * as React from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  MessageSquare,
  PieChart,
  Settings2,
  Target,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/authed/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Leads",
      url: "/authed/leads",
      icon: Target,
    },
    {
      title: "Clients",
      url: "/authed/clients",
      icon: Building2,
    },
    {
      title: "Tasks",
      url: "/authed/tasks",
      icon: Calendar,
    },
    {
      title: "Campaigns",
      url: "/authed/campaigns",
      icon: PieChart,
    },
    {
      title: "Communication",
      url: "/authed/communication",
      icon: MessageSquare,
    },
    {
      title: "Reports",
      url: "/authed/reports",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/authed/settings",
      icon: Settings2,
      items: [
        {
          title: "Account Settings",
          url: "/authed/settings/account-settings",
        },
        {
          title: "General",
          url: "/authed/settings/general",
        },
        {
          title: "Team",
          url: "/authed/settings/team",
        },
        {
          title: "Billing",
          url: "/authed/settings/billing",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: MessageSquare,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: MessageSquare,
    },
  ],
  projects: [
    {
      name: "Active Campaigns",
      url: "/authed/campaigns/active",
      icon: Target,
    },
    {
      name: "Team Tasks",
      url: "/authed/tasks/team",
      icon: Users,
    },
    {
      name: "Client Reports",
      url: "/authed/reports/clients",
      icon: Building2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = user ? {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    avatar: "/avatars/01.png", // You can add avatar functionality later
  } : {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/01.png",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Target className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CRM System</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
