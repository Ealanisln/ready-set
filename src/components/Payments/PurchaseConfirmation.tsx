import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, MessageSquare } from "lucide-react";

export default function PurchaseConfirmation({
  hours = 10,
  amount = 99.99,
}: {
  hours?: number;
  amount?: number;
}) {
  return (
    <div className="to-background flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Purchase Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Thank you for purchasing virtual assistant hours. We&apos;re excited
            to help you boost your productivity!
          </p>
          <div className="flex items-center justify-between border-b border-t py-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span>Hours Purchased</span>
            </div>
            <span className="font-semibold">{hours} hours</span>
          </div>
          <div className="flex items-center justify-between border-b py-2">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              <span>Amount Paid</span>
            </div>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Next Steps:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Check your email for a detailed receipt</li>
              <li>Log in to your account to start using your hours</li>
              <li>Reach out to our support team if you have any questions</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Go to My Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
