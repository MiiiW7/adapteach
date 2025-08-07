"use client"

import React, { useEffect, useState } from "react"
import { House, Bot, BookOpen, Settings2 } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Home",
    url: "#",
    icon: House, // sementara tidak dipakai
    isActive: true,
  },
  {
    title: "Models",
    url: "#",
    icon: Bot,
  },
  {
    title: "Documentation",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
  },
]

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar(props) {
  const [allowed, setAllowed] = useState(false)
  const [courses, setCourses] = useState([])

  const fetchCourses = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      const res = await fetch("/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data kelas")

      const formatted = data.map((course) => ({
        name: course.title,
        url: `/kelas/${course.code}`,
      }))

      setCourses(formatted)
    } catch (err) {
      console.error("Gagal mengambil data courses:", err)
      setCourses([])
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role")
      if (role === "TEACHER") {
        setAllowed(true)
        fetchCourses()
      } else {
        setAllowed(false)
      }
    }
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
        {allowed && <NavProjects projects={courses} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
