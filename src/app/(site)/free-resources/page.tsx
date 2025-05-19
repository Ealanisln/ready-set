// src/app/(site)/free-resources/page.tsx
import Breadcrumb from "@/components/Common/Breadcrumb";
import ResourcesGrid from "@/components/Resources/ResourcesGrid";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// Export with dynamic data fetching to avoid static generation problems
export const dynamic = 'force-dynamic';

async function fetchGuidesWithRetry() {
  // Import and use client only when the function is called
  const { getGuides } = await import("@/sanity/lib/queries");
  
  let retries = 3;
  let lastError = null;
  
  while (retries > 0) {
    try {
      const guides = await getGuides();
      return guides;
    } catch (error) {
      lastError = error;
      console.error(`Error fetching guides (retries left: ${retries}):`, error);
      retries--;
      // Wait 500ms before retrying
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  
  console.error("All retries failed when fetching guides:", lastError);
  return [];
}

const FreeResourcesPage = async () => {
  const guides = await fetchGuidesWithRetry();

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
          <ResourcesGrid guides={guides} basePath="free-resources" />
          <Separator className="my-8 bg-gray-200" />
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default FreeResourcesPage;