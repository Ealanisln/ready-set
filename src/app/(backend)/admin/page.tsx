import Breadcrumb from "@/components/Common/Breadcrumb";
import { Dashboard } from "@/components/Dashboard";
import { NavBar } from "@/components/Dashboard";
import { DashboardHome } from "@/components/Dashboard/DashboardHome";

import React from "react";

const Admin = () => {
  return (
    <main>
      <DashboardHome />
      {/* <Dashboard /> */}
    </main>
  );
};

export default Admin;
