"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from 'lucide-react';

const BayAreaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = [
    { name: 'SAN FRANCISCO' },
    { name: 'MARIN' },
    { name: 'EAST BAY - RICHMOND' },
    { name: 'EAST BAY - CONCORD' },
    { name: 'EAST BAY - OAKLAND' },
    { name: 'EAST BAY - HAYWARD' },
    { name: 'PENINSULA - NORTH' },
    { name: 'PENINSULA COAST' },
    { name: 'PENINSULA - SOUTH' },
    { name: 'SAN JOSE - EAST' },
    { name: 'SAN JOSE - WEST' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Bay Area California</CardTitle>
        </CardHeader>
        
        <CardContent>
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            {/* Contenedor de la imagen*/}
            <div className="relative w-full lg:w-2/3">
              <img
                src="/images/maps/Bay Area Map.jpg"
                alt="Bay Area Map"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </div>

            {/* Lista de regiones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Areas</h3>
              <div className="grid grid-cols-1 gap-2">
                {regions.map((region) => (
                  <div
                  key={region.name}
                    className= "p-3 text-left rounded-md bg-white"
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