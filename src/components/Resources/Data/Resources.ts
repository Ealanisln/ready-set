// src/components/Resources/data/resources.ts
import DeliveryLogistics from "../Guides/DeliveryLogistics";
import EmailMarketingGuide from "../Guides/EmailMarketing";
import EmailMetricsMatter from "../Guides/EmailMetricsMatter";
import EmailTesting from "../Guides/EmailTesting";
import GuideChoosePartner from "../Guides/GuideChoosePartner";
import HireVirtualAssistant from "../Guides/HireVirtualAssistant";
import StartSocialMedia from "../Guides/StartSocialMedia";

export interface Resource {
  title: string;
  description: string;
  component?: React.ComponentType; 
  imageUrl: string;
  imageFallback : string;
  downloadUrl?: string;
}


export const resources: Resource[] = [
  {
    title: "Why Email Metrics Matter",
    description: "A Business Owner's Guide to Tracking Campaign Performance",
    imageUrl: "/images/resources/1.webp",
    imageFallback: "/images/resources/1.png",
    component: EmailMetricsMatter,
    downloadUrl:
      "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLMlLRJPx8FIxYK8ng65t7CE2fGLMXaOy1oNZB",
  },
  {
    title: "What Is Email Marketing",
    description: "The Business Owner's Guide to Getting Started",
    imageUrl: "/images/resources/2.webp",
    imageFallback: "/images/resources/2.png",
    component: EmailMarketingGuide,
    downloadUrl:
      "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLqQpOUEDnRDmNThVvWg8M1eG9sx2Iaju357C4",
  },
  {
    title: "The Complete Guide to Choosing the Right Delivery Partner",
    description:
      "This comprehensive guide will help you navigate the complex process of selecting the right delivery partner for your business",
    component: GuideChoosePartner,
    imageUrl: "/images/resources/3.webp",
    imageFallback: "/images/resources/3.png",
    downloadUrl:
      "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLBKaCt1vzmKWLEJjpXc9POd8SYbl7otG5ACZQ",
  },
  {
    title: "Addressing Key Issues in Delivery Logistics",
    description: "A Practical Guide",
    component: DeliveryLogistics,
    imageUrl: "/images/resources/5.webp",
    imageFallback: "/images/resources/5.png",
    downloadUrl: "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWL7madjBWzjFmpPIJMsidl4WHhaDqZuYA2w5Ug",
  },
  {
    title: "Email A/B Testing Made Simple",
    description: "A Guide for Business Owners",
    component: EmailTesting,
    imageUrl: "/images/resources/6.webp",
    imageFallback: "/images/resources/6.png",
    downloadUrl:
      "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWL3EWLKS9QDeglwpv940XiY6aBOu5CScU7EqVk",
  },
  {
    title: "How to Hire the Right Virtual Assistant",
    description: "Your Step-by-Step Guide to Finding the Perfect VA",
    component: HireVirtualAssistant, 
    imageUrl: "/images/resources/7.png",
    imageFallback: "/images/resources/6.png",
    downloadUrl: "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLZoGTWOLe5NJ1C427fwpkQLaiRhF9yWOVKzXr"
  },

  {
    title: "How to Start Social Media Marketing Made Simple",
    description: "A Guide for Business Owners",
    component: StartSocialMedia, 
    imageUrl: "/images/resources/8.png",
    imageFallback: "/images/resources/8.png",
    downloadUrl: "https://jdjlkt28jx.ufs.sh/f/Bane1rvzmKWLXw8zL4vEAT3gOqBJ4EhXmUx2tRuliKfovNI0"
  }


];