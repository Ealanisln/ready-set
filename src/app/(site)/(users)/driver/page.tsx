import DriverDeliveries from "@/components/Driver/DriverDeliveries";
import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";

const DriverPage = () => {
  return (
    <>
      <Breadcrumb pageName="Driver orders" />
      <DriverDeliveries />
    </>
  );
};

export default DriverPage;
