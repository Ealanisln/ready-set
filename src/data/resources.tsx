import EmailMetricsMatter from "@/components/Resources/EmailMetricsMatter";
import EmailMarketingGuide from "@/components/Resources/EmailMarketing";
import GuideChoosePartner from "@/components/Resources/GuideChoosePartner";
import DeliveryLogistics from "@/components/Resources/DeliveryLogistics";
import EmailTesting from "@/components/Resources/EmailTesting";

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

    {
      title: "What Is Email Marketing",
      description: "The Business Owner's Guide to Getting Started",
      imageUrl: "/images/resources/2.png",
      content: <EmailMarketingGuide />,
    },

    {
      title: "The Complete Guide to Choosing the Right Delivery Partner",
      description: "This comprehensive guide will help you navigate the complex process of selecting the right delivery partner for your business",
      imageUrl: "/images/resources/3.png",
      content: <GuideChoosePartner />,
    },

    {
      title: "Addressing Key Issues in Delivery Logistics",
      description: "A Practical Guide",
      imageUrl: "/images/resources/3.png",
      content: <DeliveryLogistics />,
    },
    {
      title: "Email A/B Testing Made Simple",
      description: "A Guide for Business Owners",
        imageUrl: "/images/resources/3.png",
        content: <EmailTesting />,
    },
  
];