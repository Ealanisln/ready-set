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
    { name: "EAST BAY - RICHMOND" },
    { name: "EAST BAY - CONCORD" },
    { name: "EAST BAY - OAKLAND" },
    { name: "EAST BAY - HAYWARD" },
    { name: "PENINSULA - NORTH" },
    { name: "PENINSULA COAST" },
    { name: "PENINSULA - SOUTH" },
    { name: "SAN JOSE - EAST" },
    { name: "SAN JOSE - WEST" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="mb-2 text-3xl font-bold">
            Bay Area California
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-start justify-center gap-8 lg:flex-row">
            {/* Contenedor de la imagen*/}
            <div className="relative w-full lg:w-2/3">
              <Image
                src="/images/maps/Bay Area Map.jpg"
                alt="Bay Area Map"
                width={527}
                height={504}
                className="h-auto w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
              />
            </div>

            {/* Lista de regiones */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-xl font-semibold">Areas</h3>
              <div className="grid grid-cols-1 gap-2">
                {regions.map((region) => (
                  <div
                    key={region.name}
                    className="rounded-md bg-white p-3 text-left"
                  >
                    <span className="font-medium">{region.name} </span>
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
