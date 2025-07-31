import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar1 } from "@/components/navbar1";
import { Footer7 } from "@/components/footer7";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
        </SidebarProvider>
      </div>
      <Footer7 />
    </div>
  );
}