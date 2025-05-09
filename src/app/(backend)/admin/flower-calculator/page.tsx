"use client";

import { useState, useEffect } from 'react';

// Location types and their pricing
interface LocationPricing {
  clientRate: number;
  driverRate: number;
  tollFee: number;
}

interface LocationCounts {
  [key: string]: number;
}

// Improved type safety with more descriptive region types
type Region = 'SF' | 'PenNorth' | 'PenSouth' | 'PenCoast' | 'Oakland' | 'Richmond' | 'Hayward' | 'Marine' | 'EastBayConcord' | 'WestSJ';

// More descriptive pricing configuration
const LOCATION_PRICING: Record<Region, LocationPricing> = {
  'SF': { clientRate: 10.00, driverRate: 8.00, tollFee: 0 },
  'PenNorth': { clientRate: 11.00, driverRate: 9.00, tollFee: 0 },
  'PenSouth': { clientRate: 11.00, driverRate: 9.00, tollFee: 0 },
  'PenCoast': { clientRate: 11.00, driverRate: 9.00, tollFee: 0 },
  'Oakland': { clientRate: 12.00, driverRate: 10.00, tollFee: 8.00 },
  'Richmond': { clientRate: 12.00, driverRate: 10.00, tollFee: 8.00 },
  'Hayward': { clientRate: 12.00, driverRate: 10.00, tollFee: 0 },
  'Marine': { clientRate: 11.50, driverRate: 9.50, tollFee: 0 },
  'EastBayConcord': { clientRate: 10.00, driverRate: 8.00, tollFee: 0 },
  'WestSJ': { clientRate: 11.00, driverRate: 9.00, tollFee: 0 },
};

// Configuration constants
const MILES_PER_STOP = 10;
const BASE_MILES_ALLOWANCE = 10; // Additional allowance for the client
const CLIENT_MILEAGE_RATE = 2.0; // $2/mile for client extra mileage
const DRIVER_MILEAGE_RATE = 1.0; // $1/mile for driver extra mileage

// Define clear calculation output types
interface CalculationResults {
  clientPay: number;
  driverPay: number;
  totalStops: number;
  mileageAllowanceClient: number;
  mileageAllowanceDriver: number;
  extraMileageClient: number;
  extraMileageChargeClient: number;
  extraMileageDriver: number;
  extraMileageChargeDriver: number;
  tollFees: number;
  locationBreakdown: LocationBreakdown[];
}

interface LocationBreakdown {
  location: Region;
  count: number;
  clientCharge: number;
  driverPay: number;
}

const FlowerDeliveryCalculator = () => {
  // Initialize location counts with proper typing
  const [locationCounts, setLocationCounts] = useState<Record<Region, number>>(
    Object.keys(LOCATION_PRICING).reduce((acc, location) => {
      acc[location as Region] = 0;
      return acc;
    }, {} as Record<Region, number>)
  );
  
  const [totalMileage, setTotalMileage] = useState<number>(0);
  const [calculatedResults, setCalculatedResults] = useState<CalculationResults | null>(null);

  // Type-safe update function
  const updateLocationCount = (location: Region, count: number) => {
    setLocationCounts(prev => ({
      ...prev,
      [location]: Math.max(0, count) // Ensure count is not negative
    }));
  };

  // Extracted calculation functions for clarity
  const calculateTotalStops = (counts: Record<Region, number>): number => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  };

  const calculateMileageAllowances = (totalStops: number): { client: number, driver: number } => {
    return {
      client: (totalStops * MILES_PER_STOP) + BASE_MILES_ALLOWANCE,
      driver: totalStops * MILES_PER_STOP
    };
  };

  const calculateExtraMileage = (
    totalMileage: number, 
    allowances: { client: number, driver: number }
  ): { client: number, driver: number } => {
    return {
      client: Math.max(0, totalMileage - allowances.client),
      driver: Math.max(0, totalMileage - allowances.driver)
    };
  };

  const calculateExtraMileageCharges = (
    extraMileage: { client: number, driver: number }
  ): { client: number, driver: number } => {
    return {
      client: extraMileage.client * CLIENT_MILEAGE_RATE,
      driver: extraMileage.driver * DRIVER_MILEAGE_RATE
    };
  };

  const calculateLocationCharges = (
    counts: Record<Region, number>
  ): { 
    clientCharge: number, 
    driverPay: number, 
    tollFees: number, 
    breakdown: LocationBreakdown[] 
  } => {
    let clientCharge = 0;
    let driverPay = 0;
    let tollFees = 0;
    const tollLocations = new Set<string>();
    
    const breakdown = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([location, count]) => {
        const locationKey = location as Region;
        const pricing = LOCATION_PRICING[locationKey];
        const locationClientCharge = pricing.clientRate * count;
        const locationDriverPay = pricing.driverRate * count;
        
        // Only count toll fee once per location
        if (pricing.tollFee > 0 && !tollLocations.has(location)) {
          tollFees += pricing.tollFee;
          tollLocations.add(location);
        }
        
        clientCharge += locationClientCharge;
        driverPay += locationDriverPay;
        
        return {
          location: locationKey,
          count,
          clientCharge: locationClientCharge,
          driverPay: locationDriverPay
        };
      });
    
    return {
      clientCharge,
      driverPay,
      tollFees,
      breakdown
    };
  };

  // Main calculation function
  const calculateResults = () => {
    const totalStops = calculateTotalStops(locationCounts);
    
    // Early return if no stops
    if (totalStops === 0) {
      alert("Please add at least one stop before calculating.");
      return;
    }
    
    const mileageAllowances = calculateMileageAllowances(totalStops);
    const extraMileage = calculateExtraMileage(totalMileage, mileageAllowances);
    const extraMileageCharges = calculateExtraMileageCharges(extraMileage);
    
    const locationCharges = calculateLocationCharges(locationCounts);
    
    // Calculate final totals
    const clientPay = locationCharges.clientCharge + extraMileageCharges.client + locationCharges.tollFees;
    const driverPay = locationCharges.driverPay + extraMileageCharges.driver + locationCharges.tollFees;
    
    setCalculatedResults({
      clientPay,
      driverPay,
      totalStops,
      mileageAllowanceClient: mileageAllowances.client,
      mileageAllowanceDriver: mileageAllowances.driver,
      extraMileageClient: extraMileage.client,
      extraMileageChargeClient: extraMileageCharges.client,
      extraMileageDriver: extraMileage.driver,
      extraMileageChargeDriver: extraMileageCharges.driver,
      tollFees: locationCharges.tollFees,
      locationBreakdown: locationCharges.breakdown
    });
  };

  // Add a function to reset all counts
  const resetCounts = () => {
    setLocationCounts(
      Object.keys(LOCATION_PRICING).reduce((acc, location) => {
        acc[location as Region] = 0;
        return acc;
      }, {} as Record<Region, number>)
    );
    setTotalMileage(0);
    setCalculatedResults(null);
  };

  // Group locations by region for better organization
  const locationsByRegion = {
    "San Francisco": ["SF"],
    "Peninsula": ["PenNorth", "PenSouth", "PenCoast"],
    "East Bay": ["Oakland", "Richmond", "Hayward", "EastBayConcord"],
    "Other": ["Marine", "WestSJ"]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Flower Delivery Pricing Calculator</h1>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Delivery Locations</h2>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={resetCounts}
          >
            Reset All
          </button>
        </div>
        
        {/* Group locations by region */}
        {Object.entries(locationsByRegion).map(([regionName, locations]) => (
          <div key={regionName} className="mb-4">
            <h3 className="text-md font-medium text-gray-600 mb-2">{regionName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {locations.map(loc => {
                const location = loc as Region;
                return (
                <div key={location} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 font-medium">{location}</label>
                    <div className="text-xs text-gray-500">
                      <span className="text-green-600">${LOCATION_PRICING[location].clientRate.toFixed(2)}</span> / 
                      <span className="text-blue-600">${LOCATION_PRICING[location].driverRate.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="bg-red-100 text-red-800 font-bold rounded-md w-8 h-8"
                      onClick={() => updateLocationCount(location, locationCounts[location] - 1)}
                      aria-label={`Decrease ${location} count`}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      className="mx-1 w-12 p-1 text-center border rounded-md"
                      value={locationCounts[location]}
                      onChange={(e) => updateLocationCount(location, parseInt(e.target.value) || 0)}
                      min="0"
                      aria-label={`${location} count`}
                    />
                    <button 
                      className="bg-green-100 text-green-800 font-bold rounded-md w-8 h-8"
                      onClick={() => updateLocationCount(location, locationCounts[location] + 1)}
                      aria-label={`Increase ${location} count`}
                    >
                      +
                    </button>
                  </div>
                  {LOCATION_PRICING[location].tollFee > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      Toll fee: ${LOCATION_PRICING[location].tollFee.toFixed(2)}
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Total Route Mileage</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md"
          value={totalMileage}
          onChange={(e) => setTotalMileage(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.1"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the total distance for the entire delivery route
        </p>
      </div>
      
      <div className="flex space-x-3 mb-6">
        <button 
          className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          onClick={calculateResults}
        >
          Calculate
        </button>
      </div>
      
      {calculatedResults && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-3 rounded shadow">
              <h3 className="font-medium text-gray-700">Client Pay</h3>
              <p className="text-xl font-bold text-green-600">
                ${calculatedResults.clientPay.toFixed(2)}
              </p>
              
              {/* Added client payment breakdown */}
              <div className="mt-2 text-sm text-gray-600">
                <div>Base charges: ${(calculatedResults.clientPay - calculatedResults.extraMileageChargeClient - calculatedResults.tollFees).toFixed(2)}</div>
                {calculatedResults.extraMileageChargeClient > 0 && (
                  <div>Extra mileage: ${calculatedResults.extraMileageChargeClient.toFixed(2)}</div>
                )}
                {calculatedResults.tollFees > 0 && (
                  <div>Toll fees: ${calculatedResults.tollFees.toFixed(2)}</div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded shadow">
              <h3 className="font-medium text-gray-700">Driver Pay</h3>
              <p className="text-xl font-bold text-blue-600">
                ${calculatedResults.driverPay.toFixed(2)}
              </p>
              
              {/* Added driver payment breakdown */}
              <div className="mt-2 text-sm text-gray-600">
                <div>Base pay: ${(calculatedResults.driverPay - calculatedResults.extraMileageChargeDriver - calculatedResults.tollFees).toFixed(2)}</div>
                {calculatedResults.extraMileageChargeDriver > 0 && (
                  <div>Extra mileage: ${calculatedResults.extraMileageChargeDriver.toFixed(2)}</div>
                )}
                {calculatedResults.tollFees > 0 && (
                  <div>Toll fees: ${calculatedResults.tollFees.toFixed(2)}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-medium text-gray-700 mb-3">Calculation Breakdown</h3>
            
            <div className="grid grid-cols-3 gap-1 text-sm">
              <div className="font-medium">Category</div>
              <div className="font-medium text-center">Client</div>
              <div className="font-medium text-center">Driver</div>
              
              <div>Total Stops</div>
              <div className="text-center">{calculatedResults.totalStops}</div>
              <div className="text-center">{calculatedResults.totalStops}</div>
              
              <div>Mileage Allowance</div>
              <div className="text-center">{calculatedResults.mileageAllowanceClient} miles</div>
              <div className="text-center">{calculatedResults.mileageAllowanceDriver} miles</div>
              
              <div>Total Mileage</div>
              <div className="text-center">{totalMileage} miles</div>
              <div className="text-center">{totalMileage} miles</div>
              
              <div>Extra Mileage</div>
              <div className="text-center">{calculatedResults.extraMileageClient} miles</div>
              <div className="text-center">{calculatedResults.extraMileageDriver} miles</div>
              
              <div>Extra Mileage Rate</div>
              <div className="text-center">${CLIENT_MILEAGE_RATE.toFixed(2)}/mile</div>
              <div className="text-center">${DRIVER_MILEAGE_RATE.toFixed(2)}/mile</div>
              
              <div>Extra Mileage Charge</div>
              <div className="text-center">${calculatedResults.extraMileageChargeClient.toFixed(2)}</div>
              <div className="text-center">${calculatedResults.extraMileageChargeDriver.toFixed(2)}</div>
              
              <div>Toll Fees</div>
              <div className="text-center">${calculatedResults.tollFees.toFixed(2)}</div>
              <div className="text-center">${calculatedResults.tollFees.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium text-gray-700 mb-3">Location Breakdown</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Location</th>
                    <th className="text-center py-2">Count</th>
                    <th className="text-right py-2">Client Charge</th>
                    <th className="text-right py-2">Driver Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedResults.locationBreakdown.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.location}</td>
                      <td className="text-center py-2">{item.count}</td>
                      <td className="text-right py-2">${item.clientCharge.toFixed(2)}</td>
                      <td className="text-right py-2">${item.driverPay.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Help text and explanation */}
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">How calculations work:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Each stop has a base rate that varies by location</li>
          <li>Client mileage allowance: {MILES_PER_STOP} miles per stop + {BASE_MILES_ALLOWANCE} base miles</li>
          <li>Driver mileage allowance: {MILES_PER_STOP} miles per stop</li>
          <li>Extra mileage charges: ${CLIENT_MILEAGE_RATE.toFixed(2)}/mile for client, ${DRIVER_MILEAGE_RATE.toFixed(2)}/mile for driver</li>
          <li>Toll fees are only counted once per location, regardless of the number of stops</li>
        </ul>
      </div>
    </div>
  );
};

export default FlowerDeliveryCalculator;