"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from 'lucide-react';

const BayAreaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = [
    { name: 'MARIN' },
    { name: 'EAST BAY - RICHMOND' },
    { name: 'EAST BAY - CONCORD' },
    { name: 'EAST BAY - OAKLAND' },
    { name: 'SAN FRANCISCO - SOUTH' },
    { name: 'PENINSULA - NORTH' },
    { name: 'EAST BAY - HAYWARD' },
    { name: 'PENINSULA COAST' },
    { name: 'PENINSULA - SOUTH' },
    { name: 'SAN JOSE - EAST' },
    { name: 'SAN JOSE - WEST' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Bay Area</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contenedor de la imagen*/}
            <div className="relative">
              <img
                src="/images/maps/San Francisco Map.jpg"
                alt="Bay Area Map"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </div>

            {/* Lista de regiones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Areas</h3>
              <div className="grid grid-cols-1 gap-2">
                {regions.map((region) => (
                  <button
                  key={region.name}
                    className={`p-3 text-left rounded-md transition-colors duration-200 
                      ${selectedRegion === region.name 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white hover:bg-yellow-100'}`}
                    
                  >
                    <span className="font-medium">{region.name} - {region.name}</span>
                  </button>
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