"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Icon } from "@tabler/icons-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar"

interface NavSecondaryProps extends React.ComponentProps<typeof SidebarMenu> {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
  className?: string
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  return (
    <SidebarMenu {...props}>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton asChild>
            <Link to={item.url}>
              <item.icon className="!size-5" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
