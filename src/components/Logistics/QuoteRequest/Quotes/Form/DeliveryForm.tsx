import { FormEvent } from 'react';
import sendDeliveryQuoteRequest from '@/app/actions/quote-email';
import { toast } from 'react-hot-toast';

// Base types with all common fields
interface BaseFormData {
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
  driversNeeded: string;
  serviceType: string;
  deliveryRadius: string;
  selectedCounties: string[]; // Made required to match server action
}

// Common fields for forms that have delivery frequency
interface DeliveryFrequencyFields {
  deliveryFrequency: string; // Made required to match server action
  supplyPickupFrequency: string; // Made required to match server action
}

// Form specific types
interface BakeryFormData extends BaseFormData, DeliveryFrequencyFields {
  formType: 'bakery';
  deliveryTypes: Array<'bakedGoods' | 'supplies'>;
  partnerServices: string;
  routingApp: string;
}

interface FlowerFormData extends BaseFormData, DeliveryFrequencyFields {
  formType: 'flower';
  deliveryTypes: Array<'floralArrangements' | 'floralSupplies'>;
  brokerageServices: string[];
}

interface FoodFormData extends BaseFormData {
  formType: 'food';
  totalStaff: string;
  expectedDeliveries: string;
  partneredServices: string;
  multipleLocations: string;
  deliveryTimes: Array<'breakfast' | 'lunch' | 'dinner' | 'allDay'>;
  orderHeadcount: string[];
  frequency: string;
}

interface SpecialtyFormData extends BaseFormData, DeliveryFrequencyFields {
  formType: 'specialty';
  deliveryTypes: Array<'specialDelivery' | 'specialtyDelivery'>;
  fragilePackage: 'yes' | 'no';
  packageDescription: string;
}

type DeliveryFormData = 
  | BakeryFormData 
  | FlowerFormData 
  | FoodFormData 
  | SpecialtyFormData;

interface DeliveryFormProps {
  title: string;
  children: React.ReactNode;
  formType: 'bakery' | 'flower' | 'food' | 'specialty';
}

const transformFormData = (formData: FormData, formType: string): DeliveryFormData => {
  const rawData = Object.fromEntries(formData);
  
  const baseData: BaseFormData = {
    name: String(rawData.name),
    email: String(rawData.email),
    companyName: String(rawData.companyName),
    contactName: String(rawData.contactName),
    website: rawData.website ? String(rawData.website) : undefined,
    phone: String(rawData.phone),
    streetAddress: String(rawData.streetAddress),
    city: String(rawData.city),
    state: String(rawData.state),
    zipCode: String(rawData.zipCode),
    driversNeeded: String(rawData.driversNeeded),
    serviceType: String(rawData.serviceType),
    deliveryRadius: String(rawData.deliveryRadius),
    selectedCounties: formData.getAll('selectedCounties').map(String), // Always returns an array
  };

  switch (formType) {
    case 'bakery': {
      const deliveryTypes = formData.getAll('deliveryTypes')
        .map(String)
        .filter((type): type is 'bakedGoods' | 'supplies' => 
          type === 'bakedGoods' || type === 'supplies'
        );

      const bakeryData: BakeryFormData = {
        ...baseData,
        formType: 'bakery',
        deliveryTypes,
        partnerServices: String(rawData.partnerServices),
        routingApp: String(rawData.routingApp),
        deliveryFrequency: String(rawData.deliveryFrequency),
        supplyPickupFrequency: String(rawData.supplyPickupFrequency),
      };

      return bakeryData;
    }

    case 'flower': {
      const deliveryTypes = formData.getAll('deliveryTypes')
        .map(String)
        .filter((type): type is 'floralArrangements' | 'floralSupplies' => 
          type === 'floralArrangements' || type === 'floralSupplies'
        );

      const flowerData: FlowerFormData = {
        ...baseData,
        formType: 'flower',
        deliveryTypes,
        brokerageServices: formData.getAll('brokerageServices').map(String),
        deliveryFrequency: String(rawData.deliveryFrequency),
        supplyPickupFrequency: String(rawData.supplyPickupFrequency),
      };

      return flowerData;
    }

    case 'food': {
      const deliveryTimes = formData.getAll('deliveryTimes')
        .map(String)
        .filter((time): time is 'breakfast' | 'lunch' | 'dinner' | 'allDay' =>
          ['breakfast', 'lunch', 'dinner', 'allDay'].includes(time)
        );

      const foodData: FoodFormData = {
        ...baseData,
        formType: 'food',
        totalStaff: String(rawData.totalStaff),
        expectedDeliveries: String(rawData.expectedDeliveries),
        partneredServices: String(rawData.partneredServices),
        multipleLocations: String(rawData.multipleLocations),
        deliveryTimes,
        orderHeadcount: formData.getAll('orderHeadcount').map(String),
        frequency: String(rawData.frequency),
      };

      return foodData;
    }

    case 'specialty': {
      const deliveryTypes = formData.getAll('deliveryTypes')
        .map(String)
        .filter((type): type is 'specialDelivery' | 'specialtyDelivery' =>
          type === 'specialDelivery' || type === 'specialtyDelivery'
        );

      const specialtyData: SpecialtyFormData = {
        ...baseData,
        formType: 'specialty',
        deliveryTypes,
        fragilePackage: String(rawData.fragilePackage) as 'yes' | 'no',
        packageDescription: String(rawData.packageDescription),
        deliveryFrequency: String(rawData.deliveryFrequency),
        supplyPickupFrequency: String(rawData.supplyPickupFrequency),
      };

      return specialtyData;
    }

    default:
      throw new Error('Invalid form type');
  }
};

export const DeliveryForm = ({ title, children, formType }: DeliveryFormProps) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const transformedData = transformFormData(formData, formType);
      const result = await sendDeliveryQuoteRequest(transformedData);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("There was an error sending your request.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
      <button 
        type="submit" 
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Submit Request
      </button>
    </form>
  );
};