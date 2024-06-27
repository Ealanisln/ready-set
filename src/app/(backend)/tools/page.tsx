import FormNextDay from "@/components/Templates/form-next-day";
import FormSameDay from "@/components/Templates/form-same-day";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const page = () => {
  return (
    <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
      
      <div className="container">
      <Tabs defaultValue="tomorrow" className="w-full">
        <TabsList>
          <TabsTrigger value="tomorrow">Tomorrow Confirmation</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>
        <TabsContent value="tomorrow">
        <FormNextDay />
        </TabsContent>
        <TabsContent value="today">
          <FormSameDay />
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
};

export default page;
