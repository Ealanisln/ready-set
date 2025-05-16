import React from 'react';

type HostingChecklistProps = Record<string, never>; // Type-safe empty object

const HostingChecklist: React.FC<HostingChecklistProps> = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 7 Point Checklist */}
        <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-lg shadow-md">
          <div className="bg-yellow-400 p-6 text-center">
            <h2 className="text-2xl font-bold">
              7 POINT
              <br />
              CHECKLIST
            </h2>
          </div>
          <div className="h-6"></div>
          <div className="min-h-[460px] flex-grow bg-stone-600 p-6 text-white">
            <ul className="list-inside space-y-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Arrive at Caterer 5 minutes early.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Confirm item list with restaurant to ensure all items are picked up.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Deliver within the specific timeframe and send confirmations to required parties.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Sanitize the setup area, wash hands, and put on gloves.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Set up properly according to cuisine.
                  <br />
                  (Follow any special instructions.)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Confirm completion with Office Manager.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take a photo/video for the Catering Company.</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Checklist for Hosting Job */}
        <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-lg shadow-md">
          <div className="bg-yellow-400 p-6 text-center">
            <h2 className="text-2xl font-bold">
              CHECKLIST FOR
              <br />
              HOSTING JOB
            </h2>
          </div>
          <div className="h-6"></div>
          <div className="min-h-[460px] flex-grow bg-stone-600 p-6 text-white">
            <ul className="list-inside space-y-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Arrive at Caterer 5 minutes early.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Confirm item list with restaurant to ensure all items are picked up.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Deliver within the specific timeframe and send confirmations to required parties.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Sanitize the setup area, wash hands, and put on gloves.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Set up properly according to cuisine.
                  <br />
                  (Follow any special instructions.)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Refill trays</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Clean up duties</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Confirm completion with Office Manager</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take a Photo/Video for Catering Company</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="mt-8 px-8 text-center text-gray-700">
        <p className="italic">
          Here at Ready Set, we treat your business like an extension of our own. Our drivers
          undergo a training program to maximize food safety and client experience. All drivers have
          their Food Handlers Certificate in compliance with California standards, adhere to a dress
          code, wear disposable gloves, and maintain proper food handling equipment.
        </p>
      </div>
    </div>
  );
};

export default HostingChecklist;
