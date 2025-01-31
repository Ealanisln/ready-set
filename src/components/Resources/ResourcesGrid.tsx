import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailMarketingGuide from "./EmailMarketing";
import NewsletterForm from "./NewsLetterForm";
import EmailMetricsMatter from "./EmailMetricsMatter";
import GuideChoosePartner from "./GuideChoosePartner";
import DeliveryLogistics from "./DeliveryLogistics";
import EmailTesting from "./EmailTesting";
import { generateSlug } from "@/lib/create-slug";

interface Resource {
  title: string;
  description: string;
  descriptionClassName?: string;
  imageUrl: string;
}

const resources: Resource[] = [
  {
    title: "Why Email Metrics Matter",
    description: "A Business Owner's Guide to Tracking Campaign Performance",
    descriptionClassName: "mb-4 text-3xl font-bold text-gray-700 tracking-wide",
    imageUrl: "/images/resources/1.png",
  },
  {
    title: "What Is Email Marketing",
    description: "The Business Owner's Guide to Getting Started",
    descriptionClassName: "mb-4 text-3xl font-bold text-gray-700 tracking-wide",
    imageUrl: "/images/resources/2.png",
  },
  {
    title: "The Complete Guide to Choosing the Right Delivery Partner",
    description:
      "This comprehensive guide will help you navigate the complex process of selecting the right delivery partner for your business",
    descriptionClassName: "mb-4 text-3xl font-bold text-gray-700 tracking-wide",
    imageUrl: "/images/resources/3.png",
  },
];

const ResourcesGrid = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center pb-8">
            <Image
              src="/images/logo/logo.png"
              alt="logo"
              width={140}
              height={30}
              className="dark:hidden"
            />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-wide text-gray-700">
            Welcome to our free guides and resources.
          </h1>
        </div>

        {/* Resources Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden rounded-none bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex h-full flex-col">
                <CardContent className="flex-1 p-6">
                  <CardTitle className="mb-3 text-xl leading-tight">
                    {resource.title}
                  </CardTitle>
                  <p className="text-gray-600">{resource.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6">
                  <Link
                    href={`/free-resources/${generateSlug(resource.title)}`}
                    className="w-full"
                  >
                    <Button className="w-full rounded-none bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                      Learn more
                    </Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesGrid;
