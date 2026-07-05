"use client";
import { SidebarNavbarShell } from "@/components/side-nav-bar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarNavbarShell>
        {children}
      </SidebarNavbarShell>
      <Toaster position="top-center" richColors />
    </>
  );
}