import Breadcrumb from "@/components/Common/Breadcrumb";
import DriverDeliveries from "@/components/Driver/DriverDeliveries";
import React from "react";

const DriverPage = () => {
  return (
    <>
    <Breadcrumb pageName="Driver Orders" />
    <div className="mt-2 pt-8">
      <DriverDeliveries />
    </div>
    </>
  );
};

export default DriverPage;
