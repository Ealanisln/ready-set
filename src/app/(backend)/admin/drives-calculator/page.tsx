"use client";

import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface DeliveryEntry {
  id: string;
  headcount: number;
  driverStandardRate: number;
  mileage: number;
  mileageRate: number;
  toll: number;
  tip: number;
  adjustment: number;
}

interface CalculatedEntry extends DeliveryEntry {
  mileagePayout: number;
  driverStandardPay: number;
  driverBonus: number;
  totalDriverPay: number;
}

const SimplifiedPaystubCalculator: React.FC = () => {
  const [deliveries, setDeliveries] = useState<CalculatedEntry[]>([]);
  const [newDelivery, setNewDelivery] = useState<DeliveryEntry>({
    id: Date.now().toString(),
    headcount: 10, // Default headcount
    driverStandardRate: 21.50, // Default from the paystub
    mileage: 0,
    mileageRate: 0.35, // Default from the paystub
    toll: 0,
    tip: 0,
    adjustment: 0
  });
  
  const [totals, setTotals] = useState({
    mileage: 0,
    mileagePayout: 0,
    driverStandardPay: 0,
    toll: 0,
    tip: 0,
    driverBonus: 0,
    adjustment: 0,
    grandTotal: 0
  });

  // Calculate derived values for a single entry
  const calculateEntry = (entry: DeliveryEntry): CalculatedEntry => {
    const mileagePayout = parseFloat((entry.mileage * entry.mileageRate).toFixed(2));
    const driverStandardPay = parseFloat((entry.driverStandardRate + mileagePayout).toFixed(2));
    
    // Apply driver bonus logic based on headcount
    let driverBonus = 0;
    if (entry.headcount === 10) {
      driverBonus = 7.50; // For headcount 10, bonus is $7.50
    } else if (entry.headcount === 30) {
      driverBonus = 15.00; // For headcount 30, bonus is $15.00
    }
    
    const totalDriverPay = parseFloat((
      driverStandardPay + 
      entry.toll + 
      entry.tip + 
      driverBonus + 
      entry.adjustment
    ).toFixed(2));

    return {
      ...entry,
      mileagePayout,
      driverStandardPay,
      driverBonus,
      totalDriverPay
    };
  };

  // Calculate totals from all entries
  const calculateTotals = (entries: CalculatedEntry[]) => {
    const newTotals = entries.reduce((acc, entry) => {
      return {
        mileage: acc.mileage + entry.mileage,
        mileagePayout: acc.mileagePayout + entry.mileagePayout,
        driverStandardPay: acc.driverStandardPay + entry.driverStandardPay,
        toll: acc.toll + entry.toll,
        tip: acc.tip + entry.tip,
        driverBonus: acc.driverBonus + entry.driverBonus,
        adjustment: acc.adjustment + entry.adjustment,
        grandTotal: acc.grandTotal + entry.totalDriverPay
      };
    }, {
      mileage: 0,
      mileagePayout: 0,
      driverStandardPay: 0,
      toll: 0,
      tip: 0,
      driverBonus: 0,
      adjustment: 0,
      grandTotal: 0
    });

    // Round totals to 2 decimal places
    for (const key in newTotals) {
      if (key !== 'mileage' && key in newTotals) {
        const typedKey = key as keyof typeof newTotals;
        if (typedKey !== 'mileage') {
          newTotals[typedKey] = parseFloat(newTotals[typedKey].toFixed(2));
        }
      }
    }

    setTotals(newTotals);
  };

  // Recalculate totals whenever deliveries change
  useEffect(() => {
    calculateTotals(deliveries);
  }, [deliveries]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewDelivery(prev => ({
      ...prev,
      [name]: name === 'headcount' || name.includes('Rate') || name.includes('mileage') || 
              name === 'toll' || name === 'tip' || name === 'adjustment'
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Add a new delivery entry
  const handleAddDelivery = () => {
    const calculatedEntry = calculateEntry(newDelivery);
    setDeliveries([...deliveries, calculatedEntry]);
    
    // Reset form with default values
    setNewDelivery({
      id: Date.now().toString(),
      headcount: 10,
      driverStandardRate: 21.50,
      mileage: 0,
      mileageRate: 0.35,
      toll: 0,
      tip: 0,
      adjustment: 0
    });
  };

  // Remove a delivery entry
  const handleRemoveDelivery = (id: string) => {
    setDeliveries(deliveries.filter(delivery => delivery.id !== id));
  };

  // The example data from the PDF
  const loadExampleData = () => {
    const exampleEntries: DeliveryEntry[] = [
      {
        id: '1',
        headcount: 10,
        driverStandardRate: 21.50,
        mileage: 17.1,
        mileageRate: 0.35,
        toll: 0,
        tip: 0,
        adjustment: 0
      },
      {
        id: '2',
        headcount: 10,
        driverStandardRate: 21.50,
        mileage: 3,
        mileageRate: 0.35,
        toll: 0,
        tip: 0,
        adjustment: 0
      },
      {
        id: '3',
        headcount: 30,
        driverStandardRate: 21.50,
        mileage: 18.7,
        mileageRate: 0.35,
        toll: 0,
        tip: 0,
        adjustment: 0
      }
    ];
    
    setDeliveries(exampleEntries.map(entry => calculateEntry(entry)));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Driver Payment Calculator</h1>
        <p className="mb-1">Ready Set - A Professional Courier Service</p>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add New Delivery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headcount / Total Drops</label>
            <select
              name="headcount"
              value={newDelivery.headcount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value={10}>10 Drops</option>
              <option value={30}>30 Drops</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Driver Standard Rate ($)</label>
            <input
              type="number"
              step="0.01"
              name="driverStandardRate"
              value={newDelivery.driverStandardRate || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mileage</label>
            <input
              type="number"
              step="0.1"
              name="mileage"
              value={newDelivery.mileage || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mileage Rate ($)</label>
            <input
              type="number"
              step="0.01"
              name="mileageRate"
              value={newDelivery.mileageRate || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Toll ($)</label>
            <input
              type="number"
              step="0.01"
              name="toll"
              value={newDelivery.toll || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tip ($)</label>
            <input
              type="number"
              step="0.01"
              name="tip"
              value={newDelivery.tip || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Adjustment ($)</label>
            <input
              type="number"
              step="0.01"
              name="adjustment"
              value={newDelivery.adjustment || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="md:col-span-2 flex gap-2 mt-2">
            <button
              onClick={handleAddDelivery}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Delivery
            </button>
            <button
              onClick={loadExampleData}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Load Example Data
            </button>
          </div>
        </div>
      </div>

      {/* Payment Calculation Preview */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Current Calculation Preview</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm">Headcount:</div>
          <div className="text-sm font-bold">{newDelivery.headcount}</div>
          
          <div className="text-sm">Driver Standard Rate:</div>
          <div className="text-sm font-bold">${newDelivery.driverStandardRate.toFixed(2)}</div>
          
          <div className="text-sm">Mileage:</div>
          <div className="text-sm font-bold">{newDelivery.mileage.toFixed(1)}</div>
          
          <div className="text-sm">Mileage Rate:</div>
          <div className="text-sm font-bold">${newDelivery.mileageRate.toFixed(2)}</div>
          
          <div className="text-sm">Mileage Payout:</div>
          <div className="text-sm font-bold">${(newDelivery.mileage * newDelivery.mileageRate).toFixed(2)}</div>
          
          <div className="text-sm">Driver Standard Pay:</div>
          <div className="text-sm font-bold">${(newDelivery.driverStandardRate + (newDelivery.mileage * newDelivery.mileageRate)).toFixed(2)}</div>
          
          <div className="text-sm">Driver Bonus:</div>
          <div className="text-sm font-bold">${newDelivery.headcount === 10 ? '7.50' : (newDelivery.headcount === 30 ? '15.00' : '0.00')}</div>
          
          <div className="text-sm">Total Driver Pay:</div>
          <div className="text-sm font-bold text-green-600">
            ${(
              newDelivery.driverStandardRate + 
              (newDelivery.mileage * newDelivery.mileageRate) + 
              newDelivery.toll + 
              newDelivery.tip + 
              (newDelivery.headcount === 10 ? 7.50 : (newDelivery.headcount === 30 ? 15.00 : 0)) + 
              newDelivery.adjustment
            ).toFixed(2)}
          </div>
        </div>
      </div>

      {deliveries.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <h3 className="text-lg font-semibold mb-4">Deliveries</h3>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left text-sm">Headcount</th>
                <th className="border p-2 text-left text-sm">Standard Rate</th>
                <th className="border p-2 text-left text-sm">Mileage</th>
                <th className="border p-2 text-left text-sm">Mileage Rate</th>
                <th className="border p-2 text-left text-sm">Mileage Payout</th>
                <th className="border p-2 text-left text-sm">Standard Pay</th>
                <th className="border p-2 text-left text-sm">Toll</th>
                <th className="border p-2 text-left text-sm">Tip</th>
                <th className="border p-2 text-left text-sm">Driver Bonus</th>
                <th className="border p-2 text-left text-sm">Adjustment</th>
                <th className="border p-2 text-left text-sm">Total Pay</th>
                <th className="border p-2 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-sm">{delivery.headcount}</td>
                  <td className="border p-2 text-sm">${delivery.driverStandardRate.toFixed(2)}</td>
                  <td className="border p-2 text-sm">{delivery.mileage.toFixed(1)}</td>
                  <td className="border p-2 text-sm">${delivery.mileageRate.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.mileagePayout.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.driverStandardPay.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.toll.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.tip.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.driverBonus.toFixed(2)}</td>
                  <td className="border p-2 text-sm">${delivery.adjustment.toFixed(2)}</td>
                  <td className="border p-2 text-sm font-bold">${delivery.totalDriverPay.toFixed(2)}</td>
                  <td className="border p-2 text-sm">
                    <button
                      onClick={() => handleRemoveDelivery(delivery.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-2" colSpan={2}>Totals</td>
                <td className="border p-2">{totals.mileage.toFixed(1)}</td>
                <td className="border p-2"></td>
                <td className="border p-2">${totals.mileagePayout.toFixed(2)}</td>
                <td className="border p-2">${totals.driverStandardPay.toFixed(2)}</td>
                <td className="border p-2">${totals.toll.toFixed(2)}</td>
                <td className="border p-2">${totals.tip.toFixed(2)}</td>
                <td className="border p-2">${totals.driverBonus.toFixed(2)}</td>
                <td className="border p-2">${totals.adjustment.toFixed(2)}</td>
                <td className="border p-2">${totals.grandTotal.toFixed(2)}</td>
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {deliveries.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">Grand Total: ${totals.grandTotal.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default SimplifiedPaystubCalculator;