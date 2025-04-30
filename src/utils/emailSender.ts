import { Resend } from "resend";
import { DriverStatus } from "../types/order";

type PrismaAddress = {
  id: string;
  name: string | null;
  street1: string;
  street2: string | null;
  city: string;
  state: string;
  zip: string;
  county: string | null;
  locationNumber: string | null;
  parkingLoading: string | null;
  isRestaurant: boolean;
  isShared: boolean;
  createdBy: string | null;
};

type OrderUser = {
  name: string | null;
  email: string | null;
};

interface BaseOrder {
  user: OrderUser;
  address: PrismaAddress;
  delivery_address: PrismaAddress;
  order_number: string;
  brokerage?: string | null;
  date: Date | null;
  pickup_time: Date | null;
  arrival_time: Date | null;
  complete_time?: Date | null;
  order_total: number | string | null;
  client_attention: string | null;
  pickup_notes?: string | null;
  special_notes?: string | null;
  status?: string | null;
  driver_status?: DriverStatus | null;
}

interface CateringOrder extends BaseOrder {
  order_type: "catering";
  headcount?: string | null;
  need_host?: string | null;
  hours_needed?: string | null;
  number_of_host?: string | null;
}

interface OnDemandOrder extends BaseOrder {
  order_type: "on_demand";
  item_delivered: string | null;
  vehicle_type: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  weight: string | null;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type { CateringOrder, OnDemandOrder };

export async function sendOrderEmail(order: CateringOrder | OnDemandOrder) {
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: Date | null | undefined) => {
    if (!time) return "N/A";
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const formatAddress = (address: PrismaAddress) => {
    return `${address.street1}${address.street2 ? ", " + address.street2 : ""}, ${address.city}, ${address.state} ${address.zip}`;
  };

  const formatOrderTotal = (total: number | string | null) => {
    if (!total) return "0.00";
    const numericTotal = typeof total === 'number' 
      ? total 
      : typeof total === 'string' 
        ? parseFloat(total)
        : null;
    return numericTotal ? numericTotal.toFixed(2) : "0.00";
  };

  let body = `
    <h2>New Order Details:</h2>
    <p>Order Type: ${order.order_type}</p>
    <p>Order Number: ${order.order_number}</p>
    <p>Brokerage: ${order.brokerage || "N/A"}</p>
    <p>Customer Name: ${order.user.name || "N/A"}</p>
    <p>Customer Email: ${order.user.email || "N/A"}</p>
    <p>Date: ${formatDate(order.date)}</p>
    <p>Pickup Time: ${formatTime(order.pickup_time)}</p>
    <p>Arrival Time: ${formatTime(order.arrival_time)}</p>
    ${order.complete_time ? `<p>Complete Time: ${formatTime(order.complete_time)}</p>` : ''}
    <p>Order Total: $${formatOrderTotal(order.order_total)}</p>
    <p>Client Attention: ${order.client_attention || "N/A"}</p>
    <p>Pickup Notes: ${order.pickup_notes || "N/A"}</p>
    <p>Special Notes: ${order.special_notes || "N/A"}</p>
    <p>Status: ${order.status || "N/A"}</p>
    ${order.driver_status ? `<p>Driver Status: ${order.driver_status}</p>` : ''}
    <p>Pickup Address: ${formatAddress(order.address)}</p>
    <p>Drop-off Address: ${formatAddress(order.delivery_address)}</p>
  `;

  if (order.order_type === "catering") {
    body += `
      <p>Headcount: ${order.headcount || "N/A"}</p>
      <p>Need Host: ${order.need_host || "N/A"}</p>
      <p>Hours Needed: ${order.hours_needed || "N/A"}</p>
      <p>Number of Hosts: ${order.number_of_host || "N/A"}</p>
    `;
  } else {
    body += `
      <p>Item Delivered: ${order.item_delivered || "N/A"}</p>
      <p>Vehicle Type: ${order.vehicle_type || "N/A"}</p>
      <p>Dimensions: ${order.length || "N/A"} x ${order.width || "N/A"} x ${order.height || "N/A"}</p>
      <p>Weight: ${order.weight || "N/A"}</p>
    `;
  }

  try {
    await resend.emails.send({
      to: process.env.ADMIN_EMAIL || "info@ready-set.co",
      from: process.env.EMAIL_FROM || "solutions@updates.readysetllc.com",
      subject: `New ${order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)} Order - ${order.order_number}`,
      html: body,
    });
    console.log("Order notification email sent successfully");
  } catch (error) {
    console.error("Error sending order notification email:", error);
    throw error;
  }
}