// src/app/(site)/free-resources/page.tsx
import Breadcrumb from "@/components/Common/Breadcrumb";
import ResourcesGrid from "@/components/Resources/ResourcesGrid";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import { Separator } from "@/components/ui/separator";
import { getGuides } from "@/sanity/lib/queries"; // Import your data fetching function
import Image from "next/image";

const FreeResourcesPage = async () => {
  const learnMore = await getGuides(); // Fetch guides from Sanity or your data source

  return (
    <div className="container mx-auto px-4 py-16 pt-36">
      {/* Logo and Title Section */}
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <div className="mb-6">
          <Image 
            src="/images/logo/logo.png"
            alt="Ready Set Logo" 
            width={150} 
            height={60}
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-700 mb-8">
          Welcome to Our Free Guides and Resources.
        </h1>
      </div>
      
      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4">
          <ResourcesGrid guides={learnMore} basePath="free-resources" />
          <Separator className="my-8 bg-gray-200" />
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default FreeResourcesPage;