import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const BayAreaMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = [
    { id: '08', name: 'MARIN' },
    { id: '05', name: 'EAST BAY - RICHMOND' },
    { id: '04', name: 'EAST BAY - CONCORD' },
    { id: '10', name: 'EAST BAY - OAKLAND' },
    { id: '11', name: 'SAN FRANCISCO - SOUTH' },
    { id: '09', name: 'PENINSULA - NORTH' },
    { id: '06', name: 'EAST BAY - HAYWARD' },
    { id: '02', name: 'PENINSULA COAST' },
    { id: '03', name: 'PENINSULA - SOUTH' },
    { id: '01', name: 'SAN JOSE - EAST' },
    { id: '02', name: 'SAN JOSE - WEST' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Bay Area California</CardTitle>
          <p className="text-gray-600">Regiones Metropolitanas</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contenedor de la imagen */}
            <div className="relative">
              <img
                src="/San Francisco Map.jpg"
                alt="Mapa del Área de la Bahía de California"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              />
            </div>

            {/* Lista de regiones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Regiones</h3>
              <div className="grid grid-cols-1 gap-2">
                {regions.map((region) => (
                  <button
                    key={`${region.id}-${region.name}`}
                    className={`p-3 text-left rounded-md transition-colors duration-200 
                      ${selectedRegion === region.id 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white hover:bg-yellow-100'}`}
                    onClick={() => setSelectedRegion(region.id)}
                  >
                    <span className="font-medium">{region.id} - {region.name}</span>
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