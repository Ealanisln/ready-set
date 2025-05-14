"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

type Order = {
  orderNumber: string;
  pickupTime: string;
  restaurant: string;
  restaurantAddress: string;
  company: string;
  companyAddress: string;
  headcounts: string;
  totalPay: string;
  dropOffTimeStart: string;
  dropOffTimeEnd: string;
};

type Inputs = {
  driverName: string;
  helpdeskAgent: string;
  date: string;
  orders: Order[];
};

const FormNextDay = () => {
  const [persistentDate, setPersistentDate] = useState("");
  const [persistentHelpdeskAgent, setPersistentHelpdeskAgent] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      date: persistentDate,
      helpdeskAgent: persistentHelpdeskAgent,
      orders: [{}] as Order[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });

  const onSubmit = (data: Inputs) => {
    if (!data.date) {
      console.error('Date is required');
      return;
    }

    const dateParts = data.date.split("-").map(part => parseInt(part, 10));
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      console.error('Invalid date format');
      return;
    }

    const year = dateParts[0] || 0;
    const month = dateParts[1] || 1;
    const day = dateParts[2] || 1;
    
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date');
      return;
    }
    
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    let message = `Hi ${data.driverName}! This is ${data.helpdeskAgent}. Here are your food drive for tomorrow, ${formattedDate}. Please check the details and confirm. Thank you!\n`;

    data.orders.forEach((order, index) => {
      if (data.orders.length > 1) {
        message += `\n---------${index + 1}${
          index + 1 === 1
            ? "ST"
            : index + 1 === 2
              ? "ND"
              : index + 1 === 3
                ? "RD"
                : "TH"
        } ORDER----------\n`;
      }
      message += `\nORDER# ${order.orderNumber}\n`;
      message += `PICK UP: ${order.pickupTime}\n${order.restaurant} - ${order.restaurantAddress}\n`;
      message += `\n`; // Add this line to insert an extra line break
      message += `DROP OFF: ${order.dropOffTimeStart} - ${order.dropOffTimeEnd}\n${order.company} - ${order.companyAddress}\n`;
      message += `\n PAY: $${order.totalPay}\n`;
      message += `HEADCOUNT: ${order.headcounts}\n`;
    });

    alert(message);

    navigator.clipboard
      .writeText(message)
      .then(() => console.log("Message copied to clipboard"))
      .catch((err) => console.error("Failed to copy message: ", err));

    setPersistentDate(data.date);
    setPersistentHelpdeskAgent(data.helpdeskAgent);

    // Reset form with empty order
    reset({
      date: data.date,
      helpdeskAgent: data.helpdeskAgent,
      driverName: '',
      orders: [{
        orderNumber: '',
        pickupTime: '',
        restaurant: '',
        restaurantAddress: '',
        company: '',
        companyAddress: '',
        headcounts: '',
        totalPay: '',
        dropOffTimeStart: '',
        dropOffTimeEnd: ''
      }]
    });
  };

  useEffect(() => {
    setValue('date', persistentDate);
    setValue('helpdeskAgent', persistentHelpdeskAgent);
  }, [persistentDate, persistentHelpdeskAgent, setValue]);

  return (
    <div className="overflow-hidden py-8">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 ">
            <div
              className="wow fadeInUp dark:bg-gray-dark mb-12 rounded-sm px-8 py-11 shadow-three sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Next day Confirmation
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Fill the required data to get the sms template.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="date"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        {...register("date", {
                          required: "Date is required",
                        })}
                        className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.date && <span>{errors.date.message}</span>}
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="driverName"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Driver Name
                      </label>
                      <input
                        id="driverName"
                        {...register("driverName", {
                          required: "Driver name is required",
                        })}
                        className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.driverName && (
                        <span>{errors.driverName.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="helpdeskAgent"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Helpdesk Agent
                      </label>
                      <input
                        id="helpdeskAgent"
                        {...register("helpdeskAgent", {
                          required: "Helpdesk agent is required",
                        })}
                        className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                      {errors.helpdeskAgent && (
                        <span>{errors.helpdeskAgent.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="container">
                    {fields.map((field, index) => (
                      <div key={field.id}>
                        <div className="text-md mb-3 block font-medium text-dark dark:text-white">
                          <h3 className="py-4">Drive {index + 1}</h3>
                        </div>
                        <div className="-mx-4 flex flex-wrap">
                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label htmlFor={`orders.${index}.orderNumber`}>
                                Order Number
                              </label>
                              <input
                                {...register(
                                  `orders.${index}.orderNumber` as const,
                                  {
                                    required: "Order number is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.orderNumber && (
                                <span>
                                  {errors.orders?.[index]?.orderNumber?.message}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label htmlFor={`orders.${index}.pickupTime`}>
                                Pickup Time
                              </label>
                              <input
                                type="text"
                                {...register(
                                  `orders.${index}.pickupTime` as const,
                                  {
                                    required: "Pickup time is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.pickupTime && (
                                <span>
                                  {errors.orders?.[index]?.pickupTime?.message}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label htmlFor={`orders.${index}.restaurant`}>
                                Restaurant name
                              </label>
                              <input
                                {...register(
                                  `orders.${index}.restaurant` as const,
                                  {
                                    required: "Restaurant is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.restaurant && (
                                <span>
                                  {errors.orders?.[index]?.restaurant?.message}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label
                                htmlFor={`orders.${index}.restaurantAddress`}
                              >
                                Restaurant Address
                              </label>
                              <input
                                {...register(
                                  `orders.${index}.restaurantAddress` as const,
                                  {
                                    required: "Restaurant address is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.restaurantAddress && (
                                <span>
                                  {
                                    errors.orders?.[index]?.restaurantAddress
                                      ?.message
                                  }
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label htmlFor={`orders.${index}.company`}>
                                Client
                              </label>
                              <input
                                {...register(
                                  `orders.${index}.company` as const,
                                  {
                                    required: "Company is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.company && (
                                <span>
                                  {errors.orders?.[index]?.company?.message}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full px-4 md:w-1/2">
                            <div className="mb-8">
                              <label htmlFor={`orders.${index}.companyAddress`}>
                                Client Address
                              </label>
                              <input
                                {...register(
                                  `orders.${index}.companyAddress` as const,
                                  {
                                    required: "Company address is required",
                                  },
                                )}
                                className="dark:text-body-color-dark w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                              />
                              {errors.orders?.[index]?.companyAddress && (
                                <span>
                                  {
                                    errors.orders?.[index]?.companyAddress
                                      ?.message
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <Button type="submit">Generate SMS Template</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormNextDay;