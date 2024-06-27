import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="container py-16">
      <Tabs defaultValue="accotomorrowunt" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="tomorrow">Tomorrow Confirmation</TabsTrigger>
          <TabsTrigger value="today">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
