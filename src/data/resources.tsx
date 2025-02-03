import EmailMetricsMatter from "@/components/Resources/EmailMetricsMatter";
import EmailMarketingGuide from "@/components/Resources/EmailMarketing";

export interface Resource {
  title: string;
  description: string;
  imageUrl: string;
  content: React.ReactNode;
}

export const resources: Resource[] = [
  {
    title: "Why Email Metrics Matter",
    description: "A Business Owner's Guide to Tracking Campaign Performance",
    imageUrl: "/images/resources/1.png",
    content: <EmailMetricsMatter />,
  },
];