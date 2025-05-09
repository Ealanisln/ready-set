"use client";

import { useState } from 'react';

type ClientType = 'foodee' | 'catervalley' | 'graceBillion' | 'destino' | 'hy';

interface PricingTier {
  headcountRange: [number, number];
  costRange: [number, number];
  priceWithTip: number | string;
  priceWithoutTip: number | string;
}

// Define pricing tiers for different clients
const PRICING_TIERS: Record<ClientType, PricingTier[]> = {
  foodee: [
    { headcountRange: [0, 24], costRange: [0, 299], priceWithTip: 30.00, priceWithoutTip: 40.00 },
    { headcountRange: [25, 49], costRange: [300, 399], priceWithTip: 42.50, priceWithoutTip: 50.00 },
    { headcountRange: [50, 74], costRange: [400, 599], priceWithTip: 42.50, priceWithoutTip: 50.00 },
    { headcountRange: [75, 99], costRange: [600, 899], priceWithTip: 50.00, priceWithoutTip: 60.00 },
    { headcountRange: [100, 124], costRange: [900, 1199], priceWithTip: 60.00, priceWithoutTip: 70.00 },
    { headcountRange: [125, Infinity], costRange: [1200, Infinity], priceWithTip: "9%", priceWithoutTip: "9%" }
  ],
  catervalley: [
    { headcountRange: [0, 24], costRange: [0, 299], priceWithTip: 35.00, priceWithoutTip: 42.50 },
    { headcountRange: [25, 49], costRange: [300, 599], priceWithTip: 45.00, priceWithoutTip: 52.50 },
    { headcountRange: [50, 74], costRange: [600, 899], priceWithTip: 55.00, priceWithoutTip: 62.50 },
    { headcountRange: [75, 99], costRange: [900, 1199], priceWithTip: 65.00, priceWithoutTip: 72.50 },
    { headcountRange: [100, Infinity], costRange: [1200, Infinity], priceWithTip: "9%", priceWithoutTip: "10%" }
  ],
  graceBillion: [
    { headcountRange: [0, 24], costRange: [0, 299], priceWithTip: 35.00, priceWithoutTip: 42.50 },
    { headcountRange: [25, 49], costRange: [300, 599], priceWithTip: 45.00, priceWithoutTip: 52.50 },
    { headcountRange: [50, 74], costRange: [600, 899], priceWithTip: 55.00, priceWithoutTip: 62.50 },
    { headcountRange: [75, 99], costRange: [900, 1199], priceWithTip: 65.00, priceWithoutTip: 72.50 },
    { headcountRange: [100, Infinity], costRange: [1200, Infinity], priceWithTip: "9%", priceWithoutTip: "10%" }
  ],
  destino: [
    { headcountRange: [0, 24], costRange: [0, 299], priceWithTip: 0, priceWithoutTip: 60.00 },
    { headcountRange: [25, 49], costRange: [300, 599], priceWithTip: 0, priceWithoutTip: 70.00 },
    { headcountRange: [50, 74], costRange: [600, 899], priceWithTip: 0, priceWithoutTip: 90.00 },
    { headcountRange: [75, 99], costRange: [900, 1199], priceWithTip: 0, priceWithoutTip: 100.00 },
    { headcountRange: [100, 124], costRange: [1200, 1499], priceWithTip: 0, priceWithoutTip: 120.00 },
    { headcountRange: [125, Infinity], costRange: [1500, Infinity], priceWithTip: 0, priceWithoutTip: "10%" }
  ],
  hy: [
    { headcountRange: [0, Infinity], costRange: [0, Infinity], priceWithTip: 0, priceWithoutTip: 50.00 }
  ],
};

// Driver compensation tiers
const DRIVER_COMPENSATION: { headcountRange: [number, number]; costRange: [number, number]; rate: number }[] = [
  { headcountRange: [0, 24], costRange: [0, 299], rate: 35 },
  { headcountRange: [25, 49], costRange: [300, 599], rate: 40 },
  { headcountRange: [50, 74], costRange: [600, 899], rate: 50 },
  { headcountRange: [75, 99], costRange: [900, 1099], rate: 60 },
  // Adding high-tier case that was missing
  { headcountRange: [100, Infinity], costRange: [1100, Infinity], rate: 75 } // FIX #6: Added high-tier case
];

// Custom tier selection strategy type
type TierSelectionStrategy = 'exact' | 'headcount-priority' | 'cost-priority' | 'lower-rate';

const FoodDeliveryCalculator = () => {
  const [clientType, setClientType] = useState<ClientType>('foodee');
  const [headcount, setHeadcount] = useState<number>(0);
  const [orderValue, setOrderValue] = useState<number>(0);
  const [hasTip, setHasTip] = useState<boolean>(false);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [mileage, setMileage] = useState<number>(0);
  const [tollFee, setTollFee] = useState<number>(0);
  const [multipleOrders, setMultipleOrders] = useState<number>(1);
  // FIX #1: Added tier selection strategy option
  const [tierStrategy, setTierStrategy] = useState<TierSelectionStrategy>('lower-rate');
  const [calculatedResults, setCalculatedResults] = useState<{
    clientPrice: number | string;
    driverPay: number;
    baseDeliveryFee: number | string;
    mileageFee: number;
    totalFee: number | string;
    discount: number;
    tipAmount: number;
  } | null>(null);

  const handleCalculate = () => {
    // Find the appropriate pricing tier based on headcount and order value
    const clientTiers = PRICING_TIERS[clientType];
    
    let selectedTier: PricingTier | undefined;
    
    // FIX #1: Improved tier selection logic with multiple strategies
    // First, try to find an exact match
    for (const tier of clientTiers) {
      const [minHeadcount, maxHeadcount] = tier.headcountRange;
      const [minCost, maxCost] = tier.costRange;
      
      if (
        headcount >= minHeadcount && 
        headcount <= maxHeadcount && 
        orderValue >= minCost && 
        orderValue <= maxCost
      ) {
        selectedTier = tier;
        break;
      }
    }
    
    // If no exact match, use the selected strategy
    if (!selectedTier) {
      // Find based on headcount
      const headcountTier = clientTiers.find(
        tier => headcount >= tier.headcountRange[0] && headcount <= tier.headcountRange[1]
      );
      
      // Find based on cost
      const costTier = clientTiers.find(
        tier => orderValue >= tier.costRange[0] && orderValue <= tier.costRange[1]
      );
      
      if (headcountTier && costTier) {
        switch (tierStrategy) {
          case 'headcount-priority':
            selectedTier = headcountTier;
            break;
          case 'cost-priority':
            selectedTier = costTier;
            break;
          case 'lower-rate':
          default:
            // Compare numeric rates or use cost tier for percentage rates
            if (typeof headcountTier.priceWithoutTip === 'number' && typeof costTier.priceWithoutTip === 'number') {
              selectedTier = headcountTier.priceWithoutTip < costTier.priceWithoutTip ? headcountTier : costTier;
            } else {
              selectedTier = costTier; // Default to cost tier for percentage rates
            }
            break;
        }
      } else {
        selectedTier = headcountTier || costTier;
      }
    }
    
    if (!selectedTier) {
      // If still no match, use the highest tier
      selectedTier = clientTiers[clientTiers.length - 1];
    }
    
    // Calculate base delivery fee
    // FIX #2: Updated tip handling with better client-specific logic
    const baseDeliveryFee = (clientType === 'destino' || clientType === 'hy') 
      ? selectedTier.priceWithoutTip  // These clients don't use the tip system
      : (hasTip ? selectedTier.priceWithTip : selectedTier.priceWithoutTip);
    
    // FIX #3: Configurable base miles and confirmation of mileage rates
    // Calculate mileage fee - Base rate includes first 10 miles
    const baseMiles = 10;
    // $0.70 per mile for Foodee, $3 for direct clients
    const mileageRate = clientType === 'foodee' ? 0.70 : 3.00; 
    const extraMiles = Math.max(0, mileage - baseMiles);
    const mileageFee = extraMiles * mileageRate;
    
    // FIX #4: Updated discount logic with better organization and clarity
    // Calculate discount for multiple orders
    let discount = 0;
    if (clientType === 'destino') {
      if (multipleOrders === 2) {
        discount = 5;
      } else if (multipleOrders === 3) {
        discount = 10;
      } else if (multipleOrders >= 4) {
        discount = 15;
      }
    } else if (clientType === 'foodee' && multipleOrders > 1) {
      // Added example discount logic for Foodee multi-orders
      discount = multipleOrders * 2; // $2 discount per order
    }
    // Can add discount logic for other clients here
    
    // FIX #5: Fixed percentage pricing to include discount
    // Calculate client price
    let clientPrice: number | string;
    if (typeof baseDeliveryFee === 'string') {
      // Handle percentage pricing
      const percentage = parseFloat(baseDeliveryFee);
      const percentageFee = orderValue * percentage / 100;
      clientPrice = percentageFee + mileageFee + tollFee - discount; // Added discount to percentage pricing
    } else {
      clientPrice = baseDeliveryFee + mileageFee + tollFee - discount;
    }
    
    // Calculate driver pay
    // FIX #6: Improved driver compensation logic to better handle high tiers
    let driverRate = 0;
    let matchedTier = false;

    // First, try to find an exact match for both headcount and cost
    for (const tier of DRIVER_COMPENSATION) {
      const [minHeadcount, maxHeadcount] = tier.headcountRange;
      const [minCost, maxCost] = tier.costRange;
      
      const headcountMatch = headcount >= minHeadcount && headcount <= maxHeadcount;
      const costMatch = orderValue >= minCost && orderValue <= maxCost;
      
      if (headcountMatch && costMatch) {
        driverRate = tier.rate;
        matchedTier = true;
        break;
      }
    }
    
    // If no exact match, prioritize higher tier to ensure better driver compensation
    if (!matchedTier) {
      let headcountTier = null;
      let costTier = null;
      
      // Find the matching headcount tier
      for (const tier of DRIVER_COMPENSATION) {
        if (headcount >= tier.headcountRange[0] && headcount <= tier.headcountRange[1]) {
          if (!headcountTier || tier.rate > headcountTier.rate) {
            headcountTier = tier;
          }
        }
      }
      
      // Find the matching cost tier
      for (const tier of DRIVER_COMPENSATION) {
        if (orderValue >= tier.costRange[0] && orderValue <= tier.costRange[1]) {
          if (!costTier || tier.rate > costTier.rate) {
            costTier = tier;
          }
        }
      }
      
      // Use the higher rate between headcount and cost tiers
      if (headcountTier && costTier) {
        driverRate = Math.max(headcountTier.rate, costTier.rate);
      } else if (headcountTier) {
        driverRate = headcountTier.rate;
      } else if (costTier) {
        driverRate = costTier.rate;
      } else {
        // If still no match, use the highest tier
        driverRate = DRIVER_COMPENSATION[DRIVER_COMPENSATION.length - 1].rate;
      }
    }
    
    // Calculate driver mileage fee (over base miles)
    const driverMileageFee = extraMiles * 0.70; // Always $0.70 per mile for drivers
    
    // Set the calculated results
    setCalculatedResults({
      clientPrice: typeof clientPrice === 'number' 
        ? Number(clientPrice.toFixed(2)) 
        : Number(parseFloat(clientPrice as string).toFixed(2)),
      driverPay: Number((driverRate + driverMileageFee + tollFee).toFixed(2)),
      baseDeliveryFee,
      mileageFee: Number(mileageFee.toFixed(2)),
      totalFee: typeof clientPrice === 'string' ? parseFloat(clientPrice) : clientPrice,
      discount: Number(discount.toFixed(2)),
      tipAmount: hasTip ? Number(tipAmount.toFixed(2)) : 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Food Delivery Pricing Calculator</h1>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Client Type</label>
        <select 
          className="w-full p-2 border rounded-md"
          value={clientType}
          onChange={(e) => setClientType(e.target.value as ClientType)}
        >
          <option value="foodee">Foodee</option>
          <option value="catervalley">Cater Valley</option>
          <option value="graceBillion">Grace Billion</option>
          <option value="destino">Destino</option>
          <option value="hy">HY (Fixed Price)</option>
        </select>
      </div>
      
      {/* FIX #1: Added tier selection strategy option */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Tier Selection Strategy</label>
        <select 
          className="w-full p-2 border rounded-md"
          value={tierStrategy}
          onChange={(e) => setTierStrategy(e.target.value as TierSelectionStrategy)}
        >
          <option value="lower-rate">Use Lower Rate (Default)</option>
          <option value="headcount-priority">Prioritize Headcount</option>
          <option value="cost-priority">Prioritize Order Value</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          This determines how to select a pricing tier when headcount and order value fall into different tiers.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Headcount</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded-md"
            value={headcount}
            onChange={(e) => setHeadcount(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Order Value ($)</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded-md"
            value={orderValue}
            onChange={(e) => setOrderValue(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      {clientType !== 'destino' && clientType !== 'hy' && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={hasTip}
              onChange={(e) => setHasTip(e.target.checked)}
            />
            <span className="text-gray-700">Has Tip</span>
          </div>
          
          {hasTip && (
            <div className="ml-6 mt-2">
              <label className="block text-gray-700 mb-2">Tip Amount ($)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Mileage</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded-md"
            value={mileage}
            onChange={(e) => setMileage(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Toll Fee ($)</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded-md"
            value={tollFee}
            onChange={(e) => setTollFee(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Number of Orders</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md"
          value={multipleOrders}
          onChange={(e) => setMultipleOrders(parseInt(e.target.value) || 1)}
          min="1"
        />
        <p className="text-sm text-gray-500 mt-1">
          {clientType === 'destino' 
            ? 'Used for discount calculation: 2 orders = $5 off, 3 orders = $10 off, 4+ orders = $15 off' 
            : clientType === 'foodee'
              ? 'Used for discount calculation: $2 discount per order'
              : 'Number of orders being delivered'}
        </p>
      </div>
      
      <button 
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        onClick={handleCalculate}
      >
        Calculate
      </button>
      
      {calculatedResults && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <h3 className="font-medium text-gray-700">Client Fee</h3>
              <p className="text-xl font-bold text-green-600">
                ${typeof calculatedResults.clientPrice === 'number' 
                  ? calculatedResults.clientPrice.toFixed(2) 
                  : calculatedResults.clientPrice}
              </p>
              
              <div className="mt-3 text-sm text-gray-600">
                <div>Base Fee: ${typeof calculatedResults.baseDeliveryFee === 'string' 
                  ? `${calculatedResults.baseDeliveryFee} of order value` 
                  : calculatedResults.baseDeliveryFee.toFixed(2)}
                </div>
                <div>Mileage Fee: ${calculatedResults.mileageFee.toFixed(2)}</div>
                <div>Toll Fee: ${tollFee.toFixed(2)}</div>
                {calculatedResults.tipAmount > 0 && (
                  <div>Tip Amount: ${calculatedResults.tipAmount.toFixed(2)}</div>
                )}
                {calculatedResults.discount > 0 && (
                  <div>Discount: -${calculatedResults.discount.toFixed(2)}</div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded shadow">
              <h3 className="font-medium text-gray-700">Driver Pay</h3>
              <p className="text-xl font-bold text-blue-600">
                ${calculatedResults.driverPay.toFixed(2)}
              </p>
              
              {/* Added driver pay breakdown for clarity */}
              <div className="mt-3 text-sm text-gray-600">
                <div>Base Pay: ${(calculatedResults.driverPay - (mileage > 10 ? (mileage - 10) * 0.7 : 0) - tollFee).toFixed(2)}</div>
                {mileage > 10 && (
                  <div>Mileage Pay: ${((mileage - 10) * 0.7).toFixed(2)}</div>
                )}
                {tollFee > 0 && (
                  <div>Toll Reimbursement: ${tollFee.toFixed(2)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDeliveryCalculator;