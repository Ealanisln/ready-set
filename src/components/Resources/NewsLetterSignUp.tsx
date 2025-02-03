import Image from "next/image";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Button } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";

const NewsLetterSignup = () => {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">

{/* Newsletter Signup */}
<Card className="mx-auto max-w-2xl rounded-none">
<CardHeader>
  <CardTitle className="text-center">
    Newsletter Alert and Discounts
  </CardTitle>
</CardHeader>
<CardContent>
  <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="firstName">First name</Label>
      <Input
        id="firstName"
        placeholder="First name"
        className="rounded-none"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        placeholder="Last name"
        className="rounded-none"
      />
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="Email address"
        className="rounded-none"
      />
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="industry">Industry</Label>
      <Input
        id="industry"
        placeholder="Your industry"
        className="rounded-none"
      />
    </div>
  </form>
</CardContent>
<CardFooter>
  <Button className="w-full rounded-none bg-gray-900 text-white hover:bg-gray-800">
    Subscribe Now
  </Button>
</CardFooter>
</Card>


</div>
    </div>
  );
};

export default NewsLetterSignup;
