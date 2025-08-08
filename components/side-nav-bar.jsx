import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar1 } from "@/components/navbar1";

function SidebarContent({ children }) {
  const { state } = useSidebar();
  
  return (
    <div className="flex flex-col min-h-screen w-full pb-20">
      {/* Navbar dengan sticky positioning */}
      <div className="sticky top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <Navbar1 />
      </div>
      
      {/* Container utama dengan flex layout */}
      <div className="flex flex-1">
        {/* Sidebar dengan sticky positioning */}
        <div className="sticky top-16 left-0 h-[calc(100vh-4rem)] z-10 bg-background">
          <AppSidebar />
        </div>
        
        {/* Main content dengan margin dinamis */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            state === 'expanded' ? 'ml-0 lg:ml-0' : 'ml-0'
          }`}
        >
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function SidebarNavbarShell({ children }) {
  return (
    <SidebarProvider>
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  );
}