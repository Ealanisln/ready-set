// src/app/(site)/free-resources/page.tsx
import Breadcrumb from "@/components/Common/Breadcrumb";
import ResourcesGrid from "@/components/Resources/ResourcesGrid";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import { Separator } from "@/components/ui/separator";
import { getGuides } from "@/sanity/lib/queries"; // Import your data fetching function
import Image from "next/image";

export const revalidate = 30;

const FreeResourcesPage = async () => {
  const guides = await getGuides(); // Fetch guides from Sanity or your data source

  return (
    <div className="container mx-auto px-4 py-16 pt-36">
      {/* Logo and Title Section */}
      <div className="mb-12 flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <Image
            src="/images/logo/logo.png"
            alt="Ready Set Logo"
            width={150}
            height={60}
            priority
          />
        </div>
        <h1 className="mb-8 text-4xl font-bold text-slate-700">
          Welcome to Our Free Guides and Resources.
        </h1>
      </div>

      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4">
          <ResourcesGrid guides={guides} basePath="free-resources" />
          <Separator className="my-8 bg-gray-200" />
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default FreeResourcesPage;
