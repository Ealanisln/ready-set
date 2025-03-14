import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with the authentication link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The link you used may be expired or invalid. Please try requesting a
            new magic link to sign in.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/sign-in">Send New Magic Link</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}