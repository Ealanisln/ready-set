import React from 'react';
import { Card } from '@/components/ui/card';

const BayAreaMap = () => {
  return (
    <Card className="p-8 bg-yellow-400">
      <svg 
        viewBox="0 0 800 800" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Marin */}
        <path 
          d="M200 100 L300 100 L350 150 L300 200 L250 180 L200 150 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="220" y="160" className="text-sm font-bold">08 - MARIN</text>

        {/* Richmond */}
        <path 
          d="M350 150 L450 150 L475 200 L425 250 L375 225 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="360" y="200" className="text-sm font-bold">05 - EAST BAY RICHMOND</text>

        {/* Concord */}
        <path 
          d="M475 150 L575 150 L600 200 L550 250 L500 225 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="490" y="200" className="text-sm font-bold">04 - EAST BAY CONCORD</text>

        {/* San Francisco */}
        <path 
          d="M250 250 L300 250 L325 300 L275 350 L225 325 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="240" y="300" className="text-sm font-bold">11 - SAN FRANCISCO SOUTH</text>

        {/* Oakland */}
        <path 
          d="M375 275 L475 275 L500 325 L450 375 L400 350 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="385" y="325" className="text-sm font-bold">10 - EAST BAY OAKLAND</text>

        {/* Peninsula North */}
        <path 
          d="M200 350 L300 350 L325 400 L275 450 L225 425 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="210" y="400" className="text-sm font-bold">09 - PENINSULA NORTH</text>

        {/* Hayward */}
        <path 
          d="M450 375 L550 375 L575 425 L525 475 L475 450 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="460" y="425" className="text-sm font-bold">06 - EAST BAY HAYWARD</text>

        {/* Peninsula Coast */}
        <path 
          d="M150 450 L250 450 L275 500 L225 550 L175 525 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="160" y="500" className="text-sm font-bold">02 - PENINSULA COAST</text>

        {/* Peninsula South */}
        <path 
          d="M250 500 L350 500 L375 550 L325 600 L275 575 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="260" y="550" className="text-sm font-bold">03 - PENINSULA SOUTH</text>

        {/* San Jose West */}
        <path 
          d="M300 600 L400 600 L425 650 L375 700 L325 675 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="310" y="650" className="text-sm font-bold">02 - SAN JOSE WEST</text>

        {/* San Jose East */}
        <path 
          d="M425 600 L525 600 L550 650 L500 700 L450 675 Z" 
          fill="white" 
          stroke="black" 
          strokeWidth="2"
          className="hover:fill-gray-200 transition-colors duration-200"
        />
        <text x="435" y="650" className="text-sm font-bold">01 - SAN JOSE EAST</text>

        {/* Logo */}
        <g transform="translate(100, 650) scale(0.5)">
          <path 
            d="M0 0 L40 0 L50 10 L40 20 L0 20 Z" 
            fill="black"
          />
          <text x="60" y="15" className="text-xs font-bold">ready set</text>
        </g>

      </svg>
    </Card>
  );
};

export default BayAreaMap;