import Breadcrumb from "@/components/Common/Breadcrumb";
import { Dashboard } from "@/components/Dashboard";
import { NavBar } from "@/components/Dashboard";

import React from "react";

const Admin = () => {
  return (
    <main>
      <NavBar />
      <Dashboard />
    </main>
  );
};

export default Admin;
