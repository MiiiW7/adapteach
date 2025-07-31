"use client";
import { Footer7 } from "@/components/footer7";
import { SidebarNavbarShell } from "@/components/side-nav-bar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarNavbarShell>
        {children}
      </SidebarNavbarShell>
      <Footer7 />
    </>
  );
}