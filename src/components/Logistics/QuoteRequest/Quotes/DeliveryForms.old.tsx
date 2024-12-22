import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Common form fields component for vendor information
const VendorInfoFields = ({
  register,
}: {
  register: UseFormRegister<FormData>;
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="font-medium">Client's Information</h3>
      <input
        {...register("name")}
        className="w-full rounded border p-2"
        placeholder="Name"
      />
      <input
        {...register("email")}
        type="email"
        className="w-full rounded border p-2"
        placeholder="Email Address"
      />
      <input
        {...register("companyName")}
        className="w-full rounded border p-2"
        placeholder="Company Name"
      />
      <input
        {...register("contactName")}
        className="w-full rounded border p-2"
        placeholder="Contact Name"
      />
      <input
        {...register("website")}
        className="w-full rounded border p-2"
        placeholder="Website (Optional)"
      />
    </div>

    <div className="space-y-2">
      <h3 className="font-medium">Address</h3>
      <input
        {...register("phone")}
        className="w-full rounded border p-2"
        placeholder="Phone Number"
      />
      <input
        {...register("streetAddress")}
        className="w-full rounded border p-2"
        placeholder="Street Address"
      />
      <input
        {...register("city")}
        className="w-full rounded border p-2"
        placeholder="City"
      />
      <input
        {...register("state")}
        className="w-full rounded border p-2"
        placeholder="State"
      />
      <input
        {...register("zipCode")}
        className="w-full rounded border p-2"
        placeholder="Zip Code"
      />
    </div>
  </div>
);

// Common delivery questions component
const DeliveryQuestions = ({
  register,
}: {
  register: UseFormRegister<FormData>;
}) => (
  <div className="space-y-4">
    <input
      {...register("driversNeeded")}
      className="w-full rounded border p-2"
      placeholder="How many days per week do you require drivers?"
    />
    <input
      {...register("serviceType")}
      className="w-full rounded border p-2"
      placeholder="Will this service be seasonal or year-round?"
    />
    <input
      {...register("partnerServices")}
      className="w-full rounded border p-2"
      placeholder="Are you partnered with any specific services?"
    />
    <input
      {...register("routingApp")}
      className="w-full rounded border p-2"
      placeholder="Do you use your own routing application?"
    />
    <input
      {...register("deliveryRadius")}
      className="w-full rounded border p-2"
      placeholder="What delivery radius or areas do you want to cover from your store?"
    />
  </div>
);

// Counties selection component
const CountiesSelection = ({
  register,
}: {
  register: UseFormRegister<FormData>;
}) => (
  <div className="space-y-4">
    <h3 className="font-medium">Counties Serviced</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium">California</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.alameda")} />
            <span>Alameda</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.marin")} />
            <span>Marin</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.sanFrancisco")} />
            <span>San Francisco</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.solano")} />
            <span>Solano</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.contraCosta")} />
            <span>Contra Costa</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.napa")} />
            <span>Napa</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.sanMateo")} />
            <span>San Mateo</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.sonoma")} />
            <span>Sonoma</span>
          </label>
        </div>
      </div>
      <div>
        <h4 className="font-medium">Texas</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.dallas")} />
            <span>Dallas</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("counties.travis")} />
            <span>Travis</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

// Delivery frequency component
const DeliveryFrequency = ({
  register,
}: {
  register: UseFormRegister<FormData>;
}) => (
  <div className="space-y-4">
    <h3 className="font-medium">Frequency of Deliveries per day</h3>
    <div className="grid grid-cols-2 gap-4">
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("deliveryFrequency")} value="none" />
        <span>None</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          {...register("deliveryFrequency")}
          value="101-250"
        />
        <span>101-250</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("deliveryFrequency")} value="0-24" />
        <span>0-24</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          {...register("deliveryFrequency")}
          value="251-500"
        />
        <span>251-500</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("deliveryFrequency")} value="25-100" />
        <span>25-100</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("deliveryFrequency")} value="500+" />
        <span>500+</span>
      </label>
    </div>
  </div>
);

// Supply pickup frequency component
import { UseFormRegister } from "react-hook-form";
const SupplyPickupFrequency = ({
  register,
}: {
  register: UseFormRegister<FormData>;
}) => (
  <div className="space-y-4">
    <h3 className="font-medium">Supply pick ups in a week</h3>
    <div className="grid grid-cols-2 gap-4">
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("supplyPickups")} value="none" />
        <span>None</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("supplyPickups")} value="6-10" />
        <span>6-10</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("supplyPickups")} value="1-5" />
        <span>1-5</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" {...register("supplyPickups")} value="10+" />
        <span>10+</span>
      </label>
    </div>
  </div>
);

// Base form wrapper component
interface FormData {
  [key: string]: any;
}

const DeliveryForm = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // Here you would typically handle the form submission to your server action
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-yellow-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          <div className="space-y-4">
            <textarea
              className="w-full rounded border p-2"
              placeholder="Additional Comment"
              rows={4}
            />
            <button
              type="submit"
              className="w-full rounded bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
            >
              Submit
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const FoodDeliveryForm = () => {
  const { register } = useForm();
  return (
    <DeliveryForm title="Food Delivery Questionnaire">
      <div className="space-y-4">
        <input
          {...register("driversNeeded")}
          className="w-full rounded border p-2"
          placeholder="How many days per week do you require drivers?"
        />
        <input
          {...register("serviceType")}
          className="w-full rounded border p-2"
          placeholder="Will this service be seasonal or year-round?"
        />
        <input
          {...register("totalStaff")}
          className="w-full rounded border p-2"
          placeholder="How many total staff do you currently have?"
        />
        <input
          {...register("expectedDeliveries")}
          className="w-full rounded border p-2"
          placeholder="How many deliveries per day are we anticipating?"
        />
        <input
          {...register("partneredServices")}
          className="w-full rounded border p-2"
          placeholder="What services are you partnered with?"
        />
        <input
          {...register("multipleLocations")}
          className="w-full rounded border p-2"
          placeholder="Do you have multiple locations?"
        />
        <input
          {...register("deliveryRadius")}
          className="w-full rounded border p-2"
          placeholder="What delivery radius or areas do you want to cover from your store?"
        />
      </div>
      <VendorInfoFields register={register} />
      <CountiesSelection register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">Delivery Times Needed</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTimes.breakfast")} />
            <span>Breakfast</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTimes.dinner")} />
            <span>Dinner</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTimes.lunch")} />
            <span>Lunch</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTimes.allDay")} />
            <span>All day</span>
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Order Headcount (Select all that apply)</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.1-24")} />
            <span>1-24</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.100-124")} />
            <span>100-124</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.25-49")} />
            <span>25-49</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.125-199")} />
            <span>125-199</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.50-74")} />
            <span>50-74</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.200-249")} />
            <span>200-249</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.75-99")} />
            <span>75-99</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.250-299")} />
            <span>250-299</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("orderHeadcount.300plus")} />
            <span>300+</span>
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Frequency</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("frequency")} value="1-5" />
            <span>1-5 per week</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("frequency")} value="11-25" />
            <span>11-25 per week</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("frequency")} value="6-10" />
            <span>6-10 per week</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("frequency")} value="over25" />
            <span>over 25 per week</span>
          </label>
        </div>
      </div>
    </DeliveryForm>
  );
};

export {
  BakeGoodsDeliveryForm,
  FlowerDeliveryForm,
  SpecialtyDeliveryForm,
  FoodDeliveryForm
};

const BakeGoodsDeliveryForm = () => {
  const { register } = useForm();
  return (
    <DeliveryForm title="Bake Goods Delivery Questionnaire">
      <DeliveryQuestions register={register} />
      <VendorInfoFields register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">
          Please select the types of deliveries needed for your Bakery Shop
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTypes.bakedGoods")} />
            <div>
              <span className="font-medium">Baked Goods to Your Client</span>
              <p className="text-sm text-gray-600">
                Bake goods delivered directly to your client's location
              </p>
            </div>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("deliveryTypes.supplies")} />
            <div>
              <span className="font-medium">Supplies to Your Store</span>
              <p className="text-sm text-gray-600">
                Includes a variety of items needed for your inventory, such as
                ingredients, equipment and tools, packaging supplies, etc.
              </p>
            </div>
          </label>
        </div>
      </div>
      <CountiesSelection register={register} />
      <DeliveryFrequency register={register} />
      <SupplyPickupFrequency register={register} />
    </DeliveryForm>
  );
};

const FlowerDeliveryForm = () => {
  const { register } = useForm();
  return (
    <DeliveryForm title="Flower Delivery Questionnaire">
      <DeliveryQuestions register={register} />
      <VendorInfoFields register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">
          Please select the types of deliveries needed for your shop
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("deliveryTypes.floralArrangements")}
            />
            <div>
              <span className="font-medium">
                Floral Arrangements to Your Client
              </span>
              <p className="text-sm text-gray-600">
                Floral arrangements delivered directly to your client's location
              </p>
            </div>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("deliveryTypes.floralSupplies")}
            />
            <div>
              <span className="font-medium">Floral Supplies to Your Store</span>
              <p className="text-sm text-gray-600">
                Includes a variety of items needed for your inventory, such as
                flowers, vases, plants, plant food, etc.
              </p>
            </div>
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">
          Are you partnered with any specific brokerage services?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("brokerageServices.none")} />
            <span>None</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("brokerageServices.dove")} />
            <span>Dove / Teleflora</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("brokerageServices.ftd")} />
            <span>FTD</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("brokerageServices.flowerShop")}
            />
            <span>Flower Shop Network</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("brokerageServices.lovingly")}
            />
            <span>Lovingly</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("brokerageServices.other")} />
            <span>Other</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("brokerageServices.bloomlink")}
            />
            <span>Bloom Link</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("brokerageServices.florist")} />
            <span>Florist</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("brokerageServices.bloomNation")}
            />
            <span>Bloom Nation</span>
          </label>
        </div>
      </div>
      <CountiesSelection register={register} />
      <DeliveryFrequency register={register} />
      <SupplyPickupFrequency register={register} />
    </DeliveryForm>
  );
};

const SpecialtyDeliveryForm = () => {
  const { register } = useForm();
  return (
    <DeliveryForm title="Specialty Deliveries Questionnaire">
      <div className="space-y-4">
        <input
          {...register("driversNeeded")}
          className="w-full rounded border p-2"
          placeholder="How many days per week do you require drivers?"
        />
        <input
          {...register("serviceType")}
          className="w-full rounded border p-2"
          placeholder="Will this service be seasonal or year-round?"
        />
        <input
          {...register("deliveryRadius")}
          className="w-full rounded border p-2"
          placeholder="What delivery radius or areas do you want to cover from your store?"
        />
      </div>
      <VendorInfoFields register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">
          Please select the types of deliveries needed for your shop
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("deliveryTypes.specialDelivery")}
            />
            <div>
              <span className="font-medium">
                Special Delivery to Your Client
              </span>
              <p className="text-sm text-gray-600">
                Package delivered directly to your client's location
              </p>
            </div>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("deliveryTypes.specialtyDelivery")}
            />
            <div>
              <span className="font-medium">
                Specialty Delivery to My Location
              </span>
              <p className="text-sm text-gray-600">
                Includes a variety of items needed for your inventory. (Delivery
                directly to your store location)
              </p>
            </div>
          </label>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Fragile Package</h3>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("fragilePackage")} value="yes" />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" {...register("fragilePackage")} value="no" />
            <span>No</span>
          </label>
        </div>
      </div>
      <CountiesSelection register={register} />
      <DeliveryFrequency register={register} />
      <SupplyPickupFrequency register={register} />
      <div className="space-y-4">
        <h3 className="font-medium">Describe your packages</h3>
        <textarea
          {...register("packageDescription")}
          className="w-full rounded border p-2"
          rows={4}
        />
      </div>
    </DeliveryForm>
  );
};
