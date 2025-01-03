import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { useState } from "react";

interface MessageType {
type: "success" | "error";
text: string;
}

export function TalentPoolModal() {
const [message, setMessage] = useState<MessageType | null>(null);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Simulating form submission
    try {
      // Add your form submission logic here
      setMessage({
        type: "success",
        text: "Application submitted successfully! We'll be in touch soon."
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again."
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-800 text-white hover:bg-gray-900 text-xl px-6 py-3">
          <Users className="mr-2 h-8 w-8" /> Join Our Talent Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Interested? Get in touch!</DialogTitle>
          <DialogDescription>
            Tell us about yourself and how you can contribute to our team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              name="name"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              name="email"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Tell us about your experience and interests"
              name="message"
              required
              className="w-full min-h-[120px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-500"
          >
            Submit Application
          </Button>

          {message && (
            <div
              className={`mt-4 rounded p-3 ${
                message.type === "success"
                  ? "bg-yellow-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}