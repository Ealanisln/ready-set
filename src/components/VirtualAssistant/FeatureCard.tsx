import React from "react";
import { AlertTriangle, Timer, PieChart } from "lucide-react";

interface Challenge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BusinessOverwhelm = () => {
  const challenges: Challenge[] = [
    {
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M12 4v16M7 4h10v6H7V4z"
          />
        </svg>
      ),
      title: "Feeling trapped",
      description: "in the day-to-day",
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      title: "Can't take on",
      description: "more clients",
    },
    {
      icon: <Timer className="h-8 w-8 text-yellow-500" />,
      title: "No work life balance,",
      description: "or time for friends and family (or vacations)",
    },
    {
      icon: <PieChart className="h-8 w-8 text-yellow-500" />,
      title: "Your business",
      description: "can't scale the way it is now",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Left Column */}
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            Feeling <span className="text-yellow-400">overwhelmed</span> by your
            business?
          </h1>

          <p className="text-gray-700">
            We get you. Just taking one day off probably means your operations
            would stop dead, because all decision-making depends on you!
          </p>

          <p className="text-gray-700">
            So you might be thinking a skilled virtual assistant could lighten
            your workload and make your life easier...
          </p>

          <div className="rounded-lg bg-gray-50 p-6">
            <p className="text-gray-700">
              <span className="font-bold">But here&apos;s the thing:</span> you
              would still be shouldering most of the decision-making. Plus, VAs
              thrive in organised work environments. If your business isn&apos;t
              set up properly, hiring a VA could actually add more stress for
              you!
            </p>
          </div>
        </div>

        {/* Right Column - Challenges Grid */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:mt-0">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="mt-1 flex-shrink-0">{challenge.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessOverwhelm;
