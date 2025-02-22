// src/app/(backend)/admin/layout.tsx
import { NavBar } from "@/components/Dashboard";
import { GoogleMapsScript } from "@/components/Maps/GoogleMapsScript";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleMapsScript />
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="admin-content container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </>
  );
}