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
  const [studentClasses, setStudentClasses] = useState([])
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

  const fetchStudentClasses = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      const res = await fetch("/api/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data kelas siswa")

      const formatted = data.map((cls) => ({
        name: cls.title,
        url: `/kelas/${cls.code}`,
        instructor: cls.instructor || "Tidak diketahui",
      }))

      setStudentClasses(formatted)
    } catch (err) {
      console.error("Gagal mengambil data kelas siswa:", err)
      // Mock data for development if API fails
      setStudentClasses([
        { name: "Matematika Dasar", url: "/kelas/MAT101", instructor: "Budi Santoso" },
        { name: "Bahasa Indonesia", url: "/kelas/IND101", instructor: "Siti Nurhaliza" },
        { name: "IPA", url: "/kelas/IPA101", instructor: "Ahmad Dahlan" },
        { name: "Bahasa Inggris", url: "/kelas/ENG101", instructor: "Sarah Johnson" },
      ])
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role")
      if (role === "TEACHER") {
        setAllowed(true)
        fetchCourses()
      } else if (role === "STUDENT") {
        setAllowed(true)
        fetchStudentClasses()
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
        {allowed && (
          <>
            {localStorage.getItem("role") === "STUDENT" ? (
              <NavProjects projects={studentClasses} />
            ) : (
              <NavProjects projects={courses} />
            )}
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
