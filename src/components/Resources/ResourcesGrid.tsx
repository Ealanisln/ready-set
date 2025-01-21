import Image from "next/image";
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
    description: "This comprehensive guide will help you navigate the complex process of selecting the right delivery partner for your business",
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
          <h1 className="mb-4 text-3xl font-bold text-gray-700 tracking-wide">
              Welcome to our free guides and resources.
          </h1>
        </div>

        {/* Resources Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
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
                  <p className="text-gray-600">
                    {resource.description}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6">
                  <Button className="w-full rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                    Learn more
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mx-auto max-w-2xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-center">
              Newsletter Alert and Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Your industry"
                  className="rounded-lg"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-lg bg-gray-900 text-white hover:bg-gray-800">
              Subscribe Now
            </Button>
          </CardFooter>
        </Card>
        <EmailMarketingGuide />
      </div>
    </div>
  );
};

export default ResourcesGrid;