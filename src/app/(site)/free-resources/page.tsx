import Breadcrumb from "@/components/Common/Breadcrumb";
import ResourcesGrid from "@/components/Resources/ResourcesGrid";
import NewsletterForm from "@/components/Resources/ui/NewsLetterForm";
import Testimonials from "@/components/Testimonials";
import { Separator } from "@/components/ui/separator";

const FreeResourcesPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 pt-36">
      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4">
          <ResourcesGrid />
          <Separator className="my-8 bg-gray-200" /> 
          <NewsletterForm />
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

export default FreeResourcesPage;
