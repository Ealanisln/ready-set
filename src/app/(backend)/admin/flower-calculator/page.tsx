"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';

// Define TypeScript interfaces for our data structures
interface DeliveryZone {
  id: number;
  name: string;
  area: string;
  readySetFee: number;
  driverPay: number;
  clientFee: number;
  stops: number;
  toll: number;
}

interface CalculationResult {
  subtotal: number;
  tollFee: number;
  total: number;
  driverTotal: number;
}

const FlowerCalculator = () => {
  // State management
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [extraStops, setExtraStops] = useState<number>(0);
  const [mileage, setMileage] = useState<number>(0);
  const [mileageAllowance, setMileageAllowance] = useState<number>(45);
  const [mileageRate, setMileageRate] = useState<number>(3.00);
  const [result, setResult] = useState<CalculationResult>({
    subtotal: 0,
    tollFee: 0,
    total: 0,
    driverTotal: 0
  });

  // Data from spreadsheet
  const deliveryZones = useMemo<DeliveryZone[]>(() => [
    { id: 1, name: "SF", area: "San Francisco Area - 11", readySetFee: 10.00, driverPay: 8.00, clientFee: 10.00, stops: 3, toll: 8.00 },
    { id: 2, name: "SF", area: "North Peninsula Area - 09", readySetFee: 10.00, driverPay: 8.00, clientFee: 11.00, stops: 2, toll: 0 },
    { id: 3, name: "SF", area: "East Bay Oakland/Alameda Area", readySetFee: 10.00, driverPay: 8.00, clientFee: 11.00, stops: 1, toll: 8.00 },
    { id: 4, name: "SF", area: "East Bay Richmond Area - 05", readySetFee: 10.00, driverPay: 8.00, clientFee: 12.00, stops: 4, toll: 8.00 },
    { id: 5, name: "SF", area: "Peninsula South Area - 03", readySetFee: 10.00, driverPay: 8.00, clientFee: 12.00, stops: 5, toll: 0 },
    { id: 6, name: "SF", area: "East Bay Hayward Area - 06", readySetFee: 10.00, driverPay: 8.00, clientFee: 13.00, stops: 6, toll: 8.00 },
    { id: 7, name: "SF", area: "Peninsula Coast Area - 10", readySetFee: 10.00, driverPay: 8.00, clientFee: 13.00, stops: 7, toll: 0 },
    { id: 8, name: "SF", area: "San Jose West Area - 02", readySetFee: 10.00, driverPay: 8.00, clientFee: 13.00, stops: 8, toll: 0 },
    { id: 9, name: "SF", area: "Marin Area - 08", readySetFee: 10.00, driverPay: 8.00, clientFee: 13.00, stops: 9, toll: 9.50 },
    { id: 10, name: "SF", area: "East Bay Concord Area - 04", readySetFee: 10.00, driverPay: 8.00, clientFee: 14.00, stops: 0, toll: 8.00 },
    { id: 11, name: "PENN", area: "San Jose East Area - 01", readySetFee: 11.00, driverPay: 9.00, clientFee: 14.00, stops: 0, toll: 0 },
    { id: 12, name: "PENN", area: "", readySetFee: 11.00, driverPay: 9.00, clientFee: 0, stops: 0, toll: 0 }
  ], []);

  // Find the selected zone data
  const getSelectedZone = useCallback((): DeliveryZone => {
    return deliveryZones.find(zone => zone.id === selectedZone) || deliveryZones[0];
  }, [selectedZone, deliveryZones]);

  // Calculate the totals based on inputs
  const calculateTotals = useCallback(() => {
    const zone = getSelectedZone();
    
    // Calculate mileage costs
    const extraMileage = Math.max(0, mileage - mileageAllowance);
    const mileageCost = extraMileage * mileageRate;
    
    // Calculate client fees
    const subtotal = zone.clientFee + zone.readySetFee;
    const tollFee = zone.toll;
    const totalClientFee = subtotal + tollFee + mileageCost;
    
    // Calculate driver payment
    const driverTotal = zone.driverPay + (extraStops * 5) + tollFee;
    
    setResult({
      subtotal,
      tollFee,
      total: totalClientFee,
      driverTotal
    });
  }, [getSelectedZone, mileage, mileageAllowance, mileageRate, extraStops]);

  // Calculate totals when inputs change
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Flower Delivery Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Area
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedZone}
              onChange={(e) => setSelectedZone(parseInt(e.target.value))}
            >
              {deliveryZones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.area ? `${zone.name} - ${zone.area}` : zone.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Stops
            </label>
            <input 
              type="number" 
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={extraStops}
              onChange={(e) => setExtraStops(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Mileage
            </label>
            <input 
              type="number" 
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage Allowance
            </label>
            <input 
              type="number" 
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={mileageAllowance}
              onChange={(e) => setMileageAllowance(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage Rate ($ per mile)
            </label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={mileageRate}
              onChange={(e) => setMileageRate(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Calculation Results</h2>
          
          <div className="mb-6 border-b pb-4">
            <h3 className="font-medium mb-2">Selected Zone Details</h3>
            <p><span className="font-medium">Area:</span> {getSelectedZone().area}</p>
            <p><span className="font-medium">Ready Set Fee:</span> ${getSelectedZone().readySetFee.toFixed(2)}</p>
            <p><span className="font-medium">Client Fee:</span> ${getSelectedZone().clientFee.toFixed(2)}</p>
            <p><span className="font-medium">Driver Pay:</span> ${getSelectedZone().driverPay.toFixed(2)}</p>
            <p><span className="font-medium">Toll:</span> ${getSelectedZone().toll.toFixed(2)}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Client Charges</h3>
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${result.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Toll Fee:</span>
              <span>${result.tollFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>Total Client Charge:</span>
              <span>${result.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-2">Driver Payment</h3>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Driver Pay:</span>
              <span>${result.driverTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerCalculator;
