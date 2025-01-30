import React from 'react';
import { Card } from '@/components/ui/card';

{/* Fourth Section */}
const DeliveryLogistics = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
       <section className="bg-white rounded-lg shadow-lg p-8">
         <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-6">
             <h2 className="text-4xl font-bold text-gray-800">Addressing Key Issues in Delivery Logistics</h2>
             <h3 className="text-xl text-gray-600">A Practical Guide</h3>
       
               <p className="text-gray-600">
               Are you navigating the complex world of delivery logistics? This guide equips business owners with practical solutions to the most pressing challenges in the delivery market, from optimizing operations to managing costs and ensuring customer satisfaction.
               </p>
       
               <p className="text-gray-600">
                 Whether you're launching a new delivery service or scaling your operations, this guide provides actionable insights to help you stay competitive in an ever-evolving industry.
               </p>
       
               <h2 className="text-xl font-semibold text-gray-800">Why this guide is essential:</h2>
               <div className="space-y-4">
                 <ul className="space-y-4 text-gray-600">
                   <li>• <span className="text-red-500 font-bold">Understand Key Challenges:</span> Gain insight into the most common issues faced in delivery logistics, such as last-mile delivery, cost management, and route optimization.</li>
                   <li>• <span className="text-red-500 font-bold">Actionable Solutions:</span> Learn practical strategies to overcome logistical hurdles and enhance operational efficiency.</li>
                   <li>• <span className="text-red-500 font-bold">Improve Customer Satisfaction:</span> Implement tips to enhance delivery speed, accuracy, and overall customer experience.</li>
                   <li>• <span className="text-red-500 font-bold">Save Time and Money:</span> Identify cost-effective methods to streamline your logistics processes and boost profitability.</li>
                 </ul>
               </div>
       
               <p className="text-gray-600">
               <strong>Download this must-read resource</strong> to take a step forward in mastering delivery logistics.
               </p>
       
               <p className="text-gray-600">
                 If you found this guide helpful, share it with your network or schedule a consultation call with us. Ready to take the next step in optimizing your delivery operations? Contact <span className="text-blue-500 font-bold underline">Ready Set Group</span> now!
               </p>
               </div>
       
             <div className="space-y-6">
               <Card className="bg-yellow-400 p-6 rounded-lg">
                 <img src="/images/resources/5.png" alt="Delivery person with package" 
                   className="w-full rounded-lg mb-4"/>
                 <h2 className="text-2xl font-bold text-center mb-2">
                   Addressing Key Issues
                   <div className="mt-1">in Delivery Logistics</div>
                 </h2>
                 <div className="w-32 h-px bg-black mx-auto my-4"></div>
                 <p className="text-center text-sm">A Practical Guide</p>
               </Card>
       
               <div className="flex flex-col items-center mt-4">
                 <img src="/images/logo/new-logo-ready-set.png" alt="Company logo" className="w-24 h-auto mb-2" />
                 <div className="bg-black text-white px-4 py-0 rounded-lg">
                   <p className="text-sm tracking-wider">READY SET GROUP, LLC</p>
                 </div>
               </div>
       
               <div className="space-y-4">
                 <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                   Download Now
                 </button>
                 <button className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                   Schedule a Call Today
                 </button>
               </div>
             </div>
               </div>
               </section>
        </div>
        </div>

    );
        };



export default DeliveryLogistics;