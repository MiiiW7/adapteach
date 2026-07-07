"use client";
import { SidebarNavbarShell } from "@/components/side-nav-bar";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
      router.replace("/login");
      return;
    }
    
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) throw new Error("Invalid token format");
      
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const decoded = JSON.parse(payloadJson);
      
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
      router.replace("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SidebarNavbarShell>
        {children}
      </SidebarNavbarShell>
      <Toaster position="top-center" richColors />
    </>
  );
}