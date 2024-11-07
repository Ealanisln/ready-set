// Define types for the service details
export type ServiceDetail = {
    title: string;
    description: string;
    details: string[];
  };
  
  export type ServiceDetailsType = {
    "Specialized Delivery": ServiceDetail;
    "Time-Critical Delivery": ServiceDetail;
    "Quality Guaranteed": ServiceDetail;
  };
  
  export type ServiceName = keyof ServiceDetailsType;
  
  // Define the content for each service
  export const serviceDetails: ServiceDetailsType = {
    "Specialized Delivery": {
      title: "Specialized Delivery Services",
      description: "Our specialized delivery service ensures your premium catering arrives in perfect condition.",
      details: [
        "Temperature-controlled vehicles maintain food quality",
        "Professionally trained handling staff",
        "Custom equipment for delicate items",
        "Real-time temperature monitoring",
        "Specialized packaging solutions"
      ]
    },
    "Time-Critical Delivery": {
      title: "Time-Critical Delivery Services",
      description: "When timing is everything, our precision delivery service ensures your event goes smoothly.",
      details: [
        "Guaranteed delivery windows",
        "Real-time GPS tracking",
        "Route optimization technology",
        "Backup delivery contingencies",
        "Live communication updates"
      ]
    },
    "Quality Guaranteed": {
      title: "Our Quality Guarantee",
      description: "Trusted by leading tech companies for our commitment to excellence and reliability.",
      details: [
        "100% satisfaction guarantee",
        "Industry-leading safety standards",
        "Certified food handling processes",
        "Insurance coverage included",
        "24/7 customer support"
      ]
    }
  };