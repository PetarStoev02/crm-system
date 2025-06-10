"use client";

import * as React from "react";
import {
  IconCommand,
  IconSettings,
  IconChartBar,
  IconCalendar,
  IconUsers,
  IconMessage,
  IconChartPie,
  IconTarget,
  IconLayoutDashboard,
} from "@tabler/icons-react";

import { NavMain } from "@/widgets/nav-main";
import { NavSecondary } from "@/widgets/nav-secondary";
import { NavUser } from "@/widgets/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconLayoutDashboard,
      isActive: true,
    },
    {
      title: "Leads Management",
      url: "/leads",
      icon: IconTarget,
    },
    {
      title: "Campaign Management",
      url: "/campaigns",
      icon: IconChartBar,
    },
    {
      title: "Task & Calendar",
      url: "/tasks",
      icon: IconCalendar,
    },
    {
      title: "Client Management",
      url: "/clients",
      icon: IconUsers,
    },
    {
      title: "Communication Hub",
      url: "/communication",
      icon: IconMessage,
    },
    {
      title: "Reports & Analytics",
      url: "/reports",
      icon: IconChartPie,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <IconCommand className="size-4" />
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
