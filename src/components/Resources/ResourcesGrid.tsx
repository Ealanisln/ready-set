// src/components/Resources/ResourcesGrid.tsx
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { generateSlug } from "@/lib/create-slug";
import { resources } from "./Data/Resources";

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
            Welcome to Our Free Guides and Resources.
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