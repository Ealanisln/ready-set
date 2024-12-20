interface ServiceItemProps {
    title: string;
    description: string;
  }
  
  const ServiceItem: React.FC<ServiceItemProps> = ({ title, description }) => (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="h-2 w-2 mt-2 rounded-full bg-gray-400"></div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm italic">{description}</p>
        </div>
      </div>
    </div>
  );
  
  const ServicesHelpdesk = () => {
    const services = [
      {
        title: "Order Intake and Updates",
        description: "Accepting and Updating Orders",
      },
      {
        title: "Quality Assurance",
        description: "Reviewing Pictures, and Timestamps",
      },
      {
        title: "Communication",
        description: "Facilitating interaction between store staff, drivers, and customers",
      },
      {
        title: "Platform Integration",
        description: "Maintenance of Multiple Platforms",
      },
      {
        title: "Routing",
        description: "Create, Modify and Preset Routes",
      },
      {
        title: "Issue Resolution",
        description: "Canned Messages and Responses",
      },
      {
        title: "Monitoring",
        description: "ETAs, Proof of Delivery, Photo & GPS Confirmations",
      },
      {
        title: "Logistic & Labor",
        description: "Offering Contracted Drivers & Remote Helpdesk Options",
      },
    ];
  
    return (
      <div className="w-full max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          Services and Helpdesk
        </h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <ServiceItem
                key={index}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ServicesHelpdesk;