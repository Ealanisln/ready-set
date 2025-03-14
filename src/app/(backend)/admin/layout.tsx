import { NavBar } from "@/components/Dashboard";
import { UserProvider } from '@/contexts/UserContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="admin-content">
      <UserProvider>

        {children}
        </UserProvider>

      </main>
    </>
  );
}