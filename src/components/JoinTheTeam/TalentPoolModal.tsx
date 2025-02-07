import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { useState, useRef } from "react";
import sendEmail from "@/app/actions/email";

interface MessageType {
  type: "success" | "error";
  text: string;
}

export function TalentPoolModal() {
  const [message, setMessage] = useState<MessageType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const validateMessage = (text: string): boolean => {
    if (text.length > 1000) {
      setMessage({
        type: "error",
        text: "Message cannot exceed 1000 characters.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const messageElement = e.currentTarget.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;

    if (!validateMessage(messageElement.value)) {
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      };

      const result = await sendEmail(data);

      setMessage({
        type: "success",
        text: "Application submitted successfully! We'll be in touch soon.",
      });

      formRef.current?.reset();

      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-4 rounded-lg bg-gray-800 px-8 py-4 text-xl font-medium text-white shadow-lg transition-colors duration-200 hover:bg-gray-900 hover:shadow-xl">
          <Users className="h-6 w-6" />
          Join Our Talent Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
        <DialogHeader className="bg-white dark:bg-gray-900">
          <DialogTitle className="text-2xl text-gray-900 dark:text-white">
            Interested? Get in touch!
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Tell us about yourself and how you can contribute to our team.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 py-4 bg-white dark:bg-gray-900">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              name="name"
              required
              className="w-full bg-white dark:bg-gray-800"
              disabled={isLoading}
              maxLength={1000}
              onChange={(e) => {
                const newLength = e.target.value.length;
                setCharCount(newLength);
                if (newLength > 1000) {
                  setMessage({
                    type: "error",
                    text: "Message cannot exceed 1000 characters.",
                  });
                } else {
                  setMessage(null);
                }
              }}
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Your Email"
              name="email"
              required
              className="w-full bg-white dark:bg-gray-800"
              disabled={isLoading}
            />
          </div>

          <div>
            <Textarea
              placeholder="Tell us about your experience and interests"
              name="message"
              required
              className="min-h-[120px] w-full bg-white dark:bg-gray-800"
              disabled={isLoading}
              maxLength={1000}
              onChange={(e) => {
                const newLength = e.target.value.length;
                setCharCount(newLength);
                if (newLength > 1000) {
                  setMessage({
                    type: "error",
                    text: "Message cannot exceed 1000 characters.",
                  });
                } else {
                  setMessage(null);
                }
              }}
            />
            <div className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
              {charCount}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
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