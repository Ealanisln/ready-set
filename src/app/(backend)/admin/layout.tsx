import { NavBar } from "@/components/Dashboard";

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