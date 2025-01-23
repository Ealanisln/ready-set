"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from "lucide-react";
import Image from "next/image";

const BayAreaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("");

  const regions = [
    { name: "SAN FRANCISCO" },
    { name: "MARIN" },
    { name: "CONTRA COSTA" },
    { name: "ALAMEDA" },
    { name: "SANTA CLARA" },
    { name: "SAN MATEO" },
    { name: "SANTA CRUZ" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="mb-2 text-3xl font-bold">
          Bay Area California
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
  <div className="flex flex-col items-stretch justify-center gap-8 lg:flex-row">
    {/* Image Container */}
    <div className="relative w-full lg:w-1/2">
      <div className="aspect-square w-full">
        <Image
          src="/images/maps/Bay Area Map.jpg"
          alt="Bay Area Map"
          fill
          className="rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl object-contain"
          priority
        />
      </div>
    </div>

            {/* Regions List */}
            <div className="w-full rounded-lg bg-gray-50 p-6 lg:w-1/2">
              <h3 className="mb-4 text-xl font-semibold">Areas</h3>
              <div className="grid grid-cols-1 gap-3">
                {regions.map((region) => (
                  <div
                    key={region.name}
                    className="rounded-md bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <span className="font-medium">{region.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BayAreaMap;