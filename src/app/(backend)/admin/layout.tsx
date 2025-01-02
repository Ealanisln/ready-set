import { NavBar } from "@/components/Dashboard";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/Dashboard/Sidebar/app-sidebar";
// import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="admin-content">
        {children}
      </main>
    </>
  );
}