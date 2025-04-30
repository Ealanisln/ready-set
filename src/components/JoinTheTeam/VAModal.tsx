"use client";

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Target, Brain, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";

export function VAModal() {
  const router = useRouter();

  const handleApplyClick = () => {
    const escKeyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(escKeyEvent);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-400 text-gray-800 hover:bg-yellow-500">
          Learn More <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[calc(100%-2rem)] mx-auto mt-16 md:mt-24 overflow-y-auto max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader className="bg-white dark:bg-gray-900">
          <DialogTitle className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Join Ready Set as a Virtual Assistant
          </DialogTitle>
          <div className="space-y-4 md:space-y-6 overflow-y-auto pb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white">
                Be Part of Something Great
              </h3>
              <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                Join our team of skilled virtual assistants helping businesses across the US achieve sustainable growth and success. With over 50,000 project hours delivered, we&apos;re looking for dedicated professionals to help expand our impact.
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900 dark:text-white">
                What We&apos;re Looking For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    icon: <Clock className="w-5 h-5" />,
                    title: "Time Management",
                    description: "Excellent organizational skills and ability to handle multiple tasks efficiently"
                  },
                  {
                    icon: <Target className="w-5 h-5" />,
                    title: "Problem Solving",
                    description: "Creative problem-solver who can develop efficient workflows"
                  },
                  {
                    icon: <Brain className="w-5 h-5" />,
                    title: "Initiative",
                    description: "Self-motivated with strong initiative and attention to detail"
                  },
                  {
                    icon: <BarChart className="w-5 h-5" />,
                    title: "Business Acumen",
                    description: "Understanding of business operations and growth strategies"
                  }
                ].map((item, index) => (
                  <div key={index} className="p-3 md:p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors bg-white dark:bg-gray-800">
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-600 dark:text-yellow-500 mr-2">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-white">
                What You&apos;ll Do
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                {[
                  "Help businesses streamline their operations and create efficient workflows",
                  "Manage daily tasks and priorities for business owners",
                  "Implement systems and processes for sustainable growth",
                  "Contribute to the success of businesses across various industries"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 md:p-6 rounded-lg text-center border-l-4 border-yellow-400">
              <div className="font-medium mb-3 md:mb-4 text-sm md:text-base text-gray-900 dark:text-white">
                Ready to help businesses thrive while growing your career?
              </div>
              <Link href="/signup">
                <Button 
                  onClick={handleApplyClick}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 w-full md:w-auto"
                >
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}