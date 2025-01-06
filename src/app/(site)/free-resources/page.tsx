import Breadcrumb from "@/components/Common/Breadcrumb";
import ResourcesGrid from "@/components/Resources/ResourcesGrid";
import React from "react";

const FreeResourcesPage = () => {
  return (
              <div className="container mx-auto px-4 py-16 pt-36">

          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
      <ResourcesGrid />
    </div>

    </div>
    </div>
  );
};

export default FreeResourcesPage;
