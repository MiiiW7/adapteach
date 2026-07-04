"use client"

import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items }) {
  const pathname = usePathname()

  return (
    <SidebarMenu className="gap-1 px-2">
      {items.map((item) => {
        const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              isActive={isActive}
              className={`rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-50 hover:text-indigo-700" 
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/50"
              }`}
            >
              <a href={item.url} className="flex items-center gap-3">
                {item.icon && <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"}`} />}
                <span className="text-sm font-medium">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
