"use client";
import { Footer7 } from "@/components/footer7";
import { SidebarNavbarShell } from "@/components/side-nav-bar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarNavbarShell>
        {children}
      </SidebarNavbarShell>
      <Footer7 />
      <Toaster position="top-center" richColors />
    </>
  );
}