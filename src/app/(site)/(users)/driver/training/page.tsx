import Breadcrumb from "@/components/Common/Breadcrumb";
import { DeliveryDriverTraining } from "@/components/Driver/DriverTraining";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Breadcrumb pageName="Video Training" pageDescription="Driver Training" />
      <DeliveryDriverTraining />
    </main>
  );
}
