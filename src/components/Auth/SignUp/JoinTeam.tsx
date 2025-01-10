import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Brain, MapPin, Clock, Lightbulb, Target } from 'lucide-react';

const JoinTeamSection = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Join Our Growing Team</h2>
        <p className="text-lg text-gray-600">
          Be part of delivering exceptional experiences across major tech hubs in the United States
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catering Deliveries Card */}
        <Card>
          <div className="p-6 flex flex-col min-h-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold">Catering Deliveries</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Help us deliver exceptional dining experiences to our clients
            </p>

            <div className="flex-1 space-y-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Our Locations
                </h4>
                <p className="text-gray-600">
                  San Francisco-Bay Area, Atlanta GA, Austin TX, and expanding to NYC
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What We Deliver</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    Daily on-site team lunches
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4 text-blue-600 shrink-0" />
                    Corporate events
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="w-4 h-4 text-blue-600 shrink-0" />
                    Special occasions
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Apply as Delivery Partner
              </Button>
            </div>
          </div>
        </Card>

        {/* Virtual Assistant Card */}
        <Card>
          <div className="p-6 flex flex-col min-h-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold">Virtual Assistant</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Join our team of skilled virtual assistants helping businesses achieve sustainable growth
            </p>

            <div className="flex-1 space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Key Requirements</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    Excellent time management and organizational skills
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                    Creative problem-solving abilities
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Target className="w-4 h-4 text-blue-600 shrink-0" />
                    Strong initiative and attention to detail
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Impact</h4>
                <p className="text-gray-600">
                  Over 50,000 project hours delivered, helping businesses streamline operations and create efficient workflows
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Apply as Virtual Assistant
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default JoinTeamSection;