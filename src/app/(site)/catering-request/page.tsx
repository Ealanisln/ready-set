import Breadcrumb from "@/components/Common/Breadcrumb";
import Faq from "@/components/Faq";
import { Metadata } from "next";
import CateringRequest from "@/components/CateringRequest/";
import { useState } from "react";
import AddressManager, { Address } from "@/components/AddressManager";

export const metadata: Metadata = {
  title: "Ready Set | Catering request",
  description: "Make your catering request, easy and fast.",
};

const CateringPage = () => {
  return (
    <>
      <CateringRequest />
      <Faq />
    </>
  );
};

export default CateringPage;
