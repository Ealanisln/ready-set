import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function CateringModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-400 text-gray-800 hover:bg-yellow-500">
          Learn More <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader className="bg-white dark:bg-gray-900">
          <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Catering Deliveries
          </DialogTitle>
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                Do you have experience in catering deliveries? Join our team and help us deliver exceptional dining experiences to our clients.
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                About Ready Set
              </h3>
              <div className="text-gray-700 dark:text-gray-300 mb-4">
                Ready Set has been your favorite restaurant&apos;s go-to logistics partner for catered delivery since 2019. Headquartered in the San Francisco-Bay Area, we&apos;re expanding across Atlanta, GA and Austin, TX with plans to scale to New York City.
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                What We Do
              </h3>
              <div className="text-gray-700 dark:text-gray-300 mb-4">
                We specialize in delivering exceptional catering services for:
                <span className="block mt-2 ml-4">• Daily on-site team lunches</span>
                <span className="block ml-4">• Corporate events</span>
                <span className="block ml-4">• Special occasions</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                We&apos;re proud to serve tech giants like Apple, Google, Facebook, and Netflix, delivering the highest quality food with impeccable timing.
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                Join our growing team and be part of delivering exceptional experiences across major tech hubs in the United States.
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}