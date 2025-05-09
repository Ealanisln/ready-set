import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { useState } from "react";
import TalentPoolForm from "./TalentPoolForm";

export function TalentPoolModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmitted = () => {
    // Close the dialog after successful form submission
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-4 rounded-lg bg-gray-800 px-8 py-4 text-xl font-medium text-white shadow-lg transition-colors duration-200 hover:bg-gray-900 hover:shadow-xl">
          <Users className="h-6 w-6" />
          Join Our Talent Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[calc(100%-2rem)] mx-auto mt-16 md:mt-24 overflow-y-auto max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader className="bg-white dark:bg-gray-900">
         
        </DialogHeader>
        
        <div className="py-6 overflow-y-auto">
          <TalentPoolForm onFormSubmitted={handleFormSubmitted} />
        </div>
      </DialogContent>
    </Dialog>
  );
}