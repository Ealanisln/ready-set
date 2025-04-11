import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";

const ClientPage = () => {
  return (
    <>
      <Breadcrumb pageName="Client Dashboard" />
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <h2 className="text-title-md2 font-bold text-black dark:text-white mb-5">
            Welcome to your Client Dashboard
          </h2>
          <p className="text-body-color dark:text-gray-400 mb-10">
            Here you can manage your orders, view your delivery history, and update your profile information.
          </p>
          
          {/* Client dashboard content will be added here */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Recent Orders</h3>
              <p className="text-sm">You have no recent orders.</p>
            </div>
            
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Actions</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline">Place New Order</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">View Order History</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Update Profile</a>
                </li>
              </ul>
            </div>
            
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Support</h3>
              <p className="text-sm mb-4">Need help with your order or have questions?</p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientPage;
