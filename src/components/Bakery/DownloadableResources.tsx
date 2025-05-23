'use client';

import { useState } from 'react';

interface DownloadableResourcesProps {
  className?: string;
}

const DownloadableResources: React.FC<DownloadableResourcesProps> = ({ className = '' }) => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div
      className={`mx-4 my-12 rounded-lg border-4 border-dashed border-yellow-400 p-10 ${className}`}
    >
      <h2 className="mb-10 text-center text-2xl font-bold text-gray-800">Downloadable Resources</h2>

      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8">
        <button
          className="w-64 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
          onClick={() => setOpenModal('orderTemplate')}
        >
          Order Template
        </button>

        <button
          className="w-64 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
          onClick={() => setOpenModal('adminService')}
        >
          Our Admin Service
        </button>

        <button
          className="w-64 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-yellow-500"
          onClick={() => setOpenModal('deliveryInstructions')}
        >
          Delivery Instructions
        </button>
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
            <p className="mb-6">
              This resource is under development. Please check back soon for more information.
            </p>
            <button
              className="mt-2 rounded bg-yellow-400 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
              onClick={() => setOpenModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadableResources;
