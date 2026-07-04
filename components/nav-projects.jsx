"use client"

import { BookOpen } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2 mt-4">
      <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Daftar Kelas
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 mt-1">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton 
              asChild
              className="rounded-xl px-3 py-2.5 transition-all text-slate-600 hover:text-slate-950 hover:bg-slate-100/50 cursor-pointer"
            >
              <a href={item.url} className="flex items-center gap-3">
                <BookOpen className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

