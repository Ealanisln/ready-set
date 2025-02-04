// app/terms-of-delivery/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Delivery | Company Name',
  description: 'Learn about the terms and conditions that apply to our food delivery services.',
}

export default function TermsOfDelivery() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Welcome to Ready Set. These Terms of Service outline the conditions under which we provide 
          our food delivery services to you. By using our services, you agree to these terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Delivery Areas</h2>
        <p className="mb-4">
          Our delivery services are available within specific areas. Please check if your location 
          is within our delivery radius before placing an order.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>We deliver to most urban areas within the city limits.</li>
          <li>Delivery to remote or rural areas may incur additional charges.</li>
          <li>Delivery times may vary depending on your location.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Delivery Fees</h2>
        <p className="mb-4">
          Delivery fees are calculated based on the distance from the restaurant to your delivery 
          address. The following applies:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Standard delivery fees apply within the primary delivery zone.</li>
          <li>Additional fees may apply for deliveries outside the primary zone.</li>
          <li>Promotional offers may waive delivery fees under certain conditions.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Delivery Times</h2>
        <p className="mb-4">
          We strive to deliver your order within the estimated time frame provided at checkout. 
          However, delivery times may vary due to factors such as:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Traffic conditions</li>
          <li>Weather conditions</li>
          <li>Restaurant preparation times</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Cancellations</h2>
        <p className="mb-4">
          You may cancel your order before it has been prepared by the restaurant. Once the order 
          is in preparation, cancellations may not be possible. Refunds will be processed according 
          to our refund policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our Terms of Delivery, please contact us at:{' '}
          <a href="info@ready-set.co" 
             className="text-blue-600 hover:text-blue-800 underline">
            info@ready-set.co
          </a>
        </p>
      </section>
    </div>
  )
}