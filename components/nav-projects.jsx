"use client"

import { BookOpen } from "lucide-react"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden px-2 mt-4">
      <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Daftar Kelas
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 mt-1">
        {projects.map((item) => {
          const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild
                className={`rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                  isActive 
                    ? "bg-indigo-50/80 text-indigo-600 font-bold hover:bg-indigo-50/80 hover:text-indigo-600" 
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/50"
                }`}
              >
                <a href={item.url} className="flex items-center gap-3">
                  <BookOpen className={`h-4.5 w-4.5 flex-shrink-0 ${
                    isActive ? "text-indigo-600" : "text-slate-400"
                  }`} />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

