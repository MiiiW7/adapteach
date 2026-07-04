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
  const [userRole, setUserRole] = useState("")
  const [user, setUser] = useState({
    name: "User",
    email: "",
    avatar: "",
  })

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
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")
      setUserRole(role || "")

      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]
          if (payloadBase64) {
            const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
            const decoded = JSON.parse(payloadJson)
            setUser({
              name: decoded.name || "User",
              email: decoded.email || "",
              avatar: "",
            })
          }
        } catch (e) {
          console.error("Gagal decode token di sidebar", e)
        }
      }

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

  // Dynamic main navigation links based on user role
  const dynamicNavMain = [
    {
      title: "Dashboard",
      url: userRole === "TEACHER" ? "/guru" : userRole === "STUDENT" ? "/siswa" : "/",
      icon: House,
    },
    {
      title: "Gaya Belajar",
      url: userRole === "STUDENT" ? "/siswa/pilih-gaya-belajar" : "#",
      icon: Bot,
      hidden: userRole !== "STUDENT",
    },
    {
      title: "Profil & Settings",
      url: "/profile",
      icon: Settings2,
    },
  ].filter(item => !item.hidden)

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white" {...props}>
      <SidebarHeader className="h-4" />
      <SidebarContent className="px-2">
        <NavMain items={dynamicNavMain} />
        {allowed && (
          <>
            {userRole === "STUDENT" ? (
              <NavProjects projects={studentClasses} />
            ) : (
              <NavProjects projects={courses} />
            )}
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-slate-50">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

