import { BreadcrumbNavigation } from "@/components/Dashboard";
import OnDemandOrders from "@/components/Orders/OnDemandOrders";
import React from "react";

const OnDemandPage = () => {
  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <BreadcrumbNavigation />
        </header>
        <OnDemandOrders />
      </div>
    </div>
  );
};

export default OnDemandPage;
