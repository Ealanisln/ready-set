import React, { ReactNode } from "react";
import AdminNav from "@/components/AdminNavbar";

interface CustomLayoutProps {
  children: ReactNode;
}

export default function CustomLayout({ children }: CustomLayoutProps) {
  return (
    <>
      {/* <AdminNav /> */}
      <div className="flex-grow pt-16">
        <main className="my-2 py-2">{children}</main>
      </div>
    </>
  );
}
