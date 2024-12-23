"use server";

import axios from "axios";

// Base interfaces for shared fields
interface BaseFormData {
  // Common vendor info fields
  name: string;
  email: string;
  companyName: string;
  contactName: string;
  website?: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Common delivery questions
  driversNeeded: string;
  serviceType: string;
  deliveryRadius: string;
  
  // Make selectedCounties required
  selectedCounties: string[];
}

// Bake Goods specific fields - made all relevant fields required
interface BakeryFormData extends BaseFormData {
  formType: 'bakery';
  deliveryTypes: ('bakedGoods' | 'supplies')[];
  partnerServices: string;
  routingApp: string;
  deliveryFrequency: string;
  supplyPickupFrequency: string;
}

// Flower specific fields
interface FlowerFormData extends BaseFormData {
  formType: 'flower';
  deliveryTypes: ('floralArrangements' | 'floralSupplies')[];
  brokerageServices: string[];
  deliveryFrequency: string;
  supplyPickupFrequency: string;
}

// Food specific fields
interface FoodFormData extends BaseFormData {
  formType: 'food';
  totalStaff: string;
  expectedDeliveries: string;
  partneredServices: string;
  multipleLocations: string;
  deliveryTimes: ('breakfast' | 'lunch' | 'dinner' | 'allDay')[];
  orderHeadcount: string[];
  frequency: string;
}

// Specialty specific fields
interface SpecialtyFormData extends BaseFormData {
  formType: 'specialty';
  deliveryTypes: ('specialDelivery' | 'specialtyDelivery')[];
  fragilePackage: 'yes' | 'no';
  packageDescription: string;
  deliveryFrequency: string;
  supplyPickupFrequency: string;
}

type DeliveryFormData = 
  | BakeryFormData 
  | FlowerFormData 
  | FoodFormData 
  | SpecialtyFormData;

const formatCommonFields = (data: BaseFormData) => {
  // Log common fields for debugging
  console.log('Formatting common fields:', {
    name: data.name,
    email: data.email,
    companyName: data.companyName,
    selectedCounties: data.selectedCounties
  });

  return `
    <h3>Client Information</h3>
    <ul>
      <li><strong>Name:</strong> ${data.name}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Company Name:</strong> ${data.companyName}</li>
      <li><strong>Contact Name:</strong> ${data.contactName}</li>
      ${data.website ? `<li><strong>Website:</strong> ${data.website}</li>` : ''}
    </ul>

    <h3>Contact Information</h3>
    <ul>
      <li><strong>Phone:</strong> ${data.phone}</li>
      <li><strong>Address:</strong> ${data.streetAddress}</li>
      <li><strong>City:</strong> ${data.city}</li>
      <li><strong>State:</strong> ${data.state}</li>
      <li><strong>Zip Code:</strong> ${data.zipCode}</li>
    </ul>

    <h3>Basic Delivery Information</h3>
    <ul>
      <li><strong>Drivers Needed:</strong> ${data.driversNeeded}</li>
      <li><strong>Service Type:</strong> ${data.serviceType}</li>
      <li><strong>Delivery Radius:</strong> ${data.deliveryRadius}</li>
      <li><strong>Selected Counties:</strong> ${data.selectedCounties.join(', ')}</li>
    </ul>
  `;
};

const formatSpecificFields = (data: DeliveryFormData): string => {
  // Log specific fields for debugging
  console.log('Formatting specific fields for type:', data.formType, data);

  switch (data.formType) {
    case 'bakery':
      return `
        <h3>Bakery Specific Details</h3>
        <ul>
          <li><strong>Delivery Types:</strong> ${data.deliveryTypes.map(type => 
            type === 'bakedGoods' ? 'Baked Goods to Your Client' : 
            'Supplies to Your Store'
          ).join(', ')}</li>
          <li><strong>Partner Services:</strong> ${data.partnerServices}</li>
          <li><strong>Routing App:</strong> ${data.routingApp}</li>
          <li><strong>Delivery Frequency:</strong> ${data.deliveryFrequency}</li>
          <li><strong>Supply Pickup Frequency:</strong> ${data.supplyPickupFrequency}</li>
        </ul>
      `;

    case 'flower':
      return `
        <h3>Flower Shop Specific Details</h3>
        <ul>
          <li><strong>Delivery Types:</strong> ${data.deliveryTypes.map(type =>
            type === 'floralArrangements' ? 'Floral Arrangements' :
            'Floral Supplies'
          ).join(', ')}</li>
          <li><strong>Brokerage Services:</strong> ${data.brokerageServices.join(', ')}</li>
          <li><strong>Delivery Frequency:</strong> ${data.deliveryFrequency}</li>
          <li><strong>Supply Pickup Frequency:</strong> ${data.supplyPickupFrequency}</li>
        </ul>
      `;

    case 'food':
      return `
        <h3>Food Service Specific Details</h3>
        <ul>
          <li><strong>Total Staff:</strong> ${data.totalStaff}</li>
          <li><strong>Expected Deliveries:</strong> ${data.expectedDeliveries}</li>
          <li><strong>Partnered Services:</strong> ${data.partneredServices}</li>
          <li><strong>Multiple Locations:</strong> ${data.multipleLocations}</li>
          <li><strong>Delivery Times:</strong> ${data.deliveryTimes.map(time => 
            time.charAt(0).toUpperCase() + time.slice(1)
          ).join(', ')}</li>
          <li><strong>Order Headcount:</strong> ${data.orderHeadcount.join(', ')}</li>
          <li><strong>Frequency:</strong> ${data.frequency}</li>
        </ul>
      `;

    case 'specialty':
      return `
        <h3>Specialty Delivery Details</h3>
        <ul>
          <li><strong>Delivery Types:</strong> ${data.deliveryTypes.map(type =>
            type === 'specialDelivery' ? 'Special Delivery' :
            'Specialty Delivery'
          ).join(', ')}</li>
          <li><strong>Fragile Package:</strong> ${data.fragilePackage}</li>
          <li><strong>Package Description:</strong> ${data.packageDescription}</li>
          <li><strong>Delivery Frequency:</strong> ${data.deliveryFrequency}</li>
          <li><strong>Supply Pickup Frequency:</strong> ${data.supplyPickupFrequency}</li>
        </ul>
      `;
  }
};

const sendDeliveryQuoteRequest = async (data: DeliveryFormData) => {
  // Log the complete incoming data
  console.log('Received form submission:', {
    formType: data.formType,
    name: data.name,
    email: data.email,
    companyName: data.companyName,
    selectedCounties: data.selectedCounties,
    // Log type-specific fields
    specificFields: data.formType === 'bakery' ? {
      deliveryTypes: data.deliveryTypes,
      deliveryFrequency: data.deliveryFrequency,
      supplyPickupFrequency: data.supplyPickupFrequency
    } : 'Other form type'
  });

  const formTypeLabels = {
    bakery: 'Bake Goods',
    flower: 'Flower',
    food: 'Food Service',
    specialty: 'Specialty'
  };

  const htmlContent = `
    <html>
      <body>
        <h2>New ${formTypeLabels[data.formType]} Delivery Quote Request</h2>
        ${formatCommonFields(data)}
        ${formatSpecificFields(data)}
      </body>
    </html>
  `;

  const emailData = {
    sender: {
      name: "Ready Set Logistics",
      email: "updates@readysetllc.com",
    },
    to: [
      {
        email: "info@readysetllc.com",
        name: "Ready Set",
      },
    ],
    subject: `New ${formTypeLabels[data.formType]} Delivery Quote Request`,
    htmlContent,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      emailData,
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      console.log('Email sent successfully');
      return { 
        success: true, 
        message: "Your quote request was sent successfully." 
      };
    } else {
      throw new Error("Unexpected response from email service");
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return { 
      success: false, 
      message: "There was an error sending your quote request. Please try again." 
    };
  }
};

export default sendDeliveryQuoteRequest;