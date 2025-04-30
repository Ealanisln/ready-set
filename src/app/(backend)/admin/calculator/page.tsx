"use client"

import { useState } from 'react';

// Define TypeScript interfaces for our pricing structures
interface PricingTier {
  priceRange: string;
  minValue: number;
  maxValue: number | null;
  oldCostWithTip: number | string;
  newCostWithTip: number | string;
  oldCostWithoutTip: number | string;
  newCostWithoutTip: number | string;
}

interface HeadCountTier {
  headCount: string;
  foodCostRange: string;
  headCountMin: number;
  headCountMax: number | null;
  foodCostMin: number;
  foodCostMax: number | null;
  pricingWithTip: number | string;
  pricingWithoutTip: number | string;
}

interface PricingResult {
  success: boolean;
  price?: number;
  message?: string;
  tier?: PricingTier | HeadCountTier;
  priceType?: 'fixed' | 'percentage';
  pricingModel?: 'costBased' | 'headCountBased';
}

// Define our pricing data
const costBasedPricing: PricingTier[] = [
  { 
    priceRange: "<$300", 
    minValue: 0,
    maxValue: 300,
    oldCostWithTip: 27.50, 
    newCostWithTip: 30.00, 
    oldCostWithoutTip: 35.00, 
    newCostWithoutTip: 40.00 
  },
  { 
    priceRange: "$300-399", 
    minValue: 300,
    maxValue: 399,
    oldCostWithTip: 40.00, 
    newCostWithTip: 42.50, 
    oldCostWithoutTip: 45.00, 
    newCostWithoutTip: 50.00 
  },
  { 
    priceRange: "$400-599", 
    minValue: 400,
    maxValue: 599,
    oldCostWithTip: 47.50, 
    newCostWithTip: 42.50, 
    oldCostWithoutTip: 55.00, 
    newCostWithoutTip: 50.00 
  },
  { 
    priceRange: "$600-899", 
    minValue: 600,
    maxValue: 899,
    oldCostWithTip: 60.00, 
    newCostWithTip: 50.00, 
    oldCostWithoutTip: 70.00, 
    newCostWithoutTip: 60.00 
  },
  { 
    priceRange: "$900-1199", 
    minValue: 900,
    maxValue: 1199,
    oldCostWithTip: 75.00, 
    newCostWithTip: 60.00, 
    oldCostWithoutTip: 90.00, 
    newCostWithoutTip: 70.00 
  },
  { 
    priceRange: ">$1200", 
    minValue: 1200,
    maxValue: null,
    oldCostWithTip: "9%", 
    newCostWithTip: "9%", 
    oldCostWithoutTip: "9%", 
    newCostWithoutTip: "9%" 
  }
];

const headCountPricing: HeadCountTier[] = [
  {
    headCount: "<26",
    foodCostRange: "<$300",
    headCountMin: 0,
    headCountMax: 25,
    foodCostMin: 0,
    foodCostMax: 300,
    pricingWithTip: 35.00,
    pricingWithoutTip: 42.50
  },
  {
    headCount: "26-49",
    foodCostRange: "$300-599",
    headCountMin: 26,
    headCountMax: 49,
    foodCostMin: 300,
    foodCostMax: 599,
    pricingWithTip: 45.00,
    pricingWithoutTip: 52.50
  },
  {
    headCount: "50-74",
    foodCostRange: "$600-899",
    headCountMin: 50,
    headCountMax: 74,
    foodCostMin: 600,
    foodCostMax: 899,
    pricingWithTip: 55.00,
    pricingWithoutTip: 62.50
  },
  {
    headCount: "75-99",
    foodCostRange: "$900-1199",
    headCountMin: 75,
    headCountMax: 99,
    foodCostMin: 900,
    foodCostMax: 1199,
    pricingWithTip: 65.00,
    pricingWithoutTip: 72.50
  },
  {
    headCount: "100+",
    foodCostRange: ">$1200",
    headCountMin: 100,
    headCountMax: null,
    foodCostMin: 1200,
    foodCostMax: null,
    pricingWithTip: "9% Food Cost",
    pricingWithoutTip: "10% Food Cost"
  }
];

// Calculation functions
const calculateCostBasedPrice = (foodCost: number, includeTip: boolean, useNewPricing: boolean): PricingResult => {
  // Find the applicable tier
  const tier = costBasedPricing.find(tier => 
    foodCost > tier.minValue && (tier.maxValue === null || foodCost <= tier.maxValue)
  );
  
  if (!tier) {
    return { success: false, message: "No matching pricing tier found" };
  }
  
  let price = 0;
  let priceType: 'fixed' | 'percentage' = "fixed";
  
  // Determine which pricing model to use
  if (useNewPricing) {
    if (includeTip) {
      if (typeof tier.newCostWithTip === "string" && tier.newCostWithTip.includes("%")) {
        // Percentage based
        const percentage = parseFloat(tier.newCostWithTip) / 100;
        price = foodCost * percentage;
        priceType = "percentage";
      } else {
        price = tier.newCostWithTip as number;
      }
    } else {
      if (typeof tier.newCostWithoutTip === "string" && tier.newCostWithoutTip.includes("%")) {
        // Percentage based
        const percentage = parseFloat(tier.newCostWithoutTip) / 100;
        price = foodCost * percentage;
        priceType = "percentage";
      } else {
        price = tier.newCostWithoutTip as number;
      }
    }
  } else {
    if (includeTip) {
      if (typeof tier.oldCostWithTip === "string" && tier.oldCostWithTip.includes("%")) {
        // Percentage based
        const percentage = parseFloat(tier.oldCostWithTip) / 100;
        price = foodCost * percentage;
        priceType = "percentage";
      } else {
        price = tier.oldCostWithTip as number;
      }
    } else {
      if (typeof tier.oldCostWithoutTip === "string" && tier.oldCostWithoutTip.includes("%")) {
        // Percentage based
        const percentage = parseFloat(tier.oldCostWithoutTip) / 100;
        price = foodCost * percentage;
        priceType = "percentage";
      } else {
        price = tier.oldCostWithoutTip as number;
      }
    }
  }
  
  return { 
    success: true, 
    price, 
    tier, 
    priceType,
    pricingModel: "costBased"
  };
};

const calculateHeadCountPrice = (foodCost: number, headCount: number, includeTip: boolean): PricingResult => {
  // Find the applicable tier based on head count and food cost
  const tier = headCountPricing.find(tier => 
    headCount >= tier.headCountMin && 
    (tier.headCountMax === null || headCount <= tier.headCountMax) &&
    foodCost >= tier.foodCostMin &&
    (tier.foodCostMax === null || foodCost <= tier.foodCostMax)
  );
  
  if (!tier) {
    return { success: false, message: "No matching head count pricing tier found" };
  }
  
  let price = 0;
  let priceType: 'fixed' | 'percentage' = "fixed";
  
  if (includeTip) {
    if (typeof tier.pricingWithTip === "string" && tier.pricingWithTip.includes("%")) {
      // Percentage based
      const percentageStr = tier.pricingWithTip.split("%")[0];
      const percentage = parseFloat(percentageStr) / 100;
      price = foodCost * percentage;
      priceType = "percentage";
    } else {
      price = tier.pricingWithTip as number;
    }
  } else {
    if (typeof tier.pricingWithoutTip === "string" && tier.pricingWithoutTip.includes("%")) {
      // Percentage based
      const percentageStr = tier.pricingWithoutTip.split("%")[0];
      const percentage = parseFloat(percentageStr) / 100;
      price = foodCost * percentage;
      priceType = "percentage";
    } else {
      price = tier.pricingWithoutTip as number;
    }
  }
  
  return { 
    success: true, 
    price, 
    tier, 
    priceType,
    pricingModel: "headCountBased"
  };
};

// Main calculator component
const FoodPricingCalculator = () => {
  // State variables for inputs
  const [foodCost, setFoodCost] = useState<number>(0);
  const [headCount, setHeadCount] = useState<number>(0);
  const [includeTip, setIncludeTip] = useState<boolean>(true);
  const [useNewPricing, setUseNewPricing] = useState<boolean>(true);
  const [pricingMethod, setPricingMethod] = useState<'costBased' | 'headCountBased'>('costBased');
  
  // State for results
  const [result, setResult] = useState<PricingResult | null>(null);
  
  // Calculate pricing when button is clicked
  const calculatePrice = () => {
    if (pricingMethod === 'costBased') {
      setResult(calculateCostBasedPrice(foodCost, includeTip, useNewPricing));
    } else {
      setResult(calculateHeadCountPrice(foodCost, headCount, includeTip));
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Food Pricing Calculator</h1>
      
      {/* Calculator Inputs */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Food Cost Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Cost ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={foodCost}
              onChange={(e) => setFoodCost(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Head Count Input */}
          <div className={pricingMethod === 'headCountBased' ? '' : 'opacity-50'}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Head Count
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={headCount}
              onChange={(e) => setHeadCount(Number(e.target.value))}
              disabled={pricingMethod !== 'headCountBased'}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Pricing Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pricing Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={pricingMethod === 'costBased'}
                onChange={() => setPricingMethod('costBased')}
                className="mr-2"
              />
              <span>Cost Based</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={pricingMethod === 'headCountBased'}
                onChange={() => setPricingMethod('headCountBased')}
                className="mr-2"
              />
              <span>Head Count Based</span>
            </label>
          </div>
        </div>
        
        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Include Tip Option */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeTip}
                onChange={() => setIncludeTip(!includeTip)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Include Tip</span>
            </label>
          </div>
          
          {/* Price Version */}
          <div className={pricingMethod === 'costBased' ? '' : 'opacity-50'}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useNewPricing}
                onChange={() => setUseNewPricing(!useNewPricing)}
                disabled={pricingMethod !== 'costBased'}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Use New Pricing (vs. Old)
              </span>
            </label>
          </div>
        </div>
        
        {/* Calculate Button */}
        <div>
          <button
            onClick={calculatePrice}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Calculate Price
          </button>
        </div>
      </div>
      
      {/* Results Display */}
      {result && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          {result.success ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold text-green-600">
                  ${result.price?.toFixed(2)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Price Type:</span>{' '}
                  {result.priceType === 'fixed' ? 'Fixed Rate' : 'Percentage Based'}
                </div>
                <div>
                  <span className="font-medium">Pricing Model:</span>{' '}
                  {result.pricingModel === 'costBased' ? 'Cost Based' : 'Head Count Based'}
                </div>
                {result.pricingModel === 'costBased' && (
                  <div>
                    <span className="font-medium">Price Range:</span>{' '}
                    {(result.tier as PricingTier).priceRange}
                  </div>
                )}
                {result.pricingModel === 'headCountBased' && (
                  <>
                    <div>
                      <span className="font-medium">Head Count Range:</span>{' '}
                      {(result.tier as HeadCountTier).headCount}
                    </div>
                    <div>
                      <span className="font-medium">Food Cost Range:</span>{' '}
                      {(result.tier as HeadCountTier).foodCostRange}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-red-600">{result.message}</div>
          )}
        </div>
      )}
      
      {/* Reference Tables */}
      <div className="mt-8">
        <details>
          <summary className="cursor-pointer text-blue-600 font-medium mb-3">
            View Pricing Tables
          </summary>
          
          <div className="space-y-6">
            {/* Cost Based Pricing Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Cost Based Pricing</h3>
              <div className="overflow-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Price Range</th>
                      <th className="border border-gray-300 px-4 py-2">Old Cost w/ Tip</th>
                      <th className="border border-gray-300 px-4 py-2">New Cost w/ Tip</th>
                      <th className="border border-gray-300 px-4 py-2">Old Cost w/o Tip</th>
                      <th className="border border-gray-300 px-4 py-2">New Cost w/o Tip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costBasedPricing.map((tier, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{tier.priceRange}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.oldCostWithTip}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.newCostWithTip}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.oldCostWithoutTip}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.newCostWithoutTip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Head Count Based Pricing Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Head Count Based Pricing</h3>
              <div className="overflow-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Head Count</th>
                      <th className="border border-gray-300 px-4 py-2">Food Cost Range</th>
                      <th className="border border-gray-300 px-4 py-2">Pricing w/ Tip</th>
                      <th className="border border-gray-300 px-4 py-2">Pricing w/o Tip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headCountPricing.map((tier, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{tier.headCount}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.foodCostRange}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.pricingWithTip}</td>
                        <td className="border border-gray-300 px-4 py-2">{tier.pricingWithoutTip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FoodPricingCalculator;