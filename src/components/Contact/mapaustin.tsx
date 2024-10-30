"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from 'lucide-react';

const AustinMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = [
    { name: '6801 North Capital of Texas Hwy ' },
    { name: '8322 Cross Park Dr' },
    { name: '1122 Colorado St' },
    { name: '600 Congress Av' },
    { name: '301 Congress Av' },
    { name: 'East Saint Elmo Rd' },
    { name: '4401 Freidrich Ln' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Austin Texas</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            {/* Contenedor de la imagen*/}
            <div className="relative w-full lg:w-2/3 mr-12">
              <img
                src="/images/maps/Austin Texas.jpg"
                alt="Austin Map"
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
                    <span className="font-medium">{region.name} </span>
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

export default AustinMap;