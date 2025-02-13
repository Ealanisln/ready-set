// app/refund-policy/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Ready Set',
  description: 'Learn about our refund policies for catering delivery and virtual assistance services.',
}

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <section className="mb-8">
        <p className="mb-6">
          At Ready Set, we prioritize exceptional service, whether we're delivering catered meals or supporting your business 
          with skilled virtual assistants. Your satisfaction is our top priority. If you're not completely satisfied with 
          your experience, we'll make it right.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Catering Delivery Refund Policy</h2>
        
        <h3 className="text-xl font-semibold mb-3">Eligibility for Refunds</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">We will issue a refund for orders with incorrect or missing items.</li>
          <li className="mb-2">We will process refunds for late deliveries exceeding 30 minutes past the scheduled delivery time (excluding delays caused by traffic, weather, or other unforeseeable circumstances).</li>
          <li className="mb-2">We will address food quality issues reported within 24 hours of delivery.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Exclusions</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">We will not issue refunds for customer order errors (e.g., incorrect address or order changes made after confirmation).</li>
          <li className="mb-2">We will not process refunds for situations outside our control (e.g., natural disasters, accidents, or unpreventable disruptions).</li>
          <li className="mb-2">We may not refund custom orders, special dietary requests, or orders placed with less than 48 hours' notice.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Virtual Assistance Refund Policy</h2>
        
        <h3 className="text-xl font-semibold mb-3">Eligibility for Refunds</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">We will issue a refund if work is not completed to agreed specifications.</li>
          <li className="mb-2">We will address errors in tasks caused directly by a Ready Set Virtual Assistant.</li>
          <li className="mb-2">We require disputes regarding services to be reported within 7 business days of task completion.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Exclusions</h3>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">We will not issue refunds for customer miscommunications or delays in providing required materials.</li>
          <li className="mb-2">We will not refund tasks outside the scope of agreed services or completed despite changes not communicated in time.</li>
          <li className="mb-2">We will not process refunds for customer-initiated cancellations after a service has started.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
        <p className="mb-4">Email our Customer Support Team at <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">info@ready-set.co</a> with:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Your order/task ID</li>
          <li className="mb-2">A detailed explanation of the issue</li>
          <li className="mb-2">Supporting evidence, such as photos or communications</li>
        </ul>
        <p className="mb-4">For urgent refund requests, contact us directly at <a href="tel:415-226-6872" className="text-blue-600 hover:text-blue-800">(415) 226-6872</a>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Refund Processing</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">We will review your request promptly and acknowledge receipt within 1 business day.</li>
          <li className="mb-2">We will process refunds within 7-10 business days, depending on your payment method.</li>
          <li className="mb-2">Additional time may be needed for the funds to appear in your account.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
        <p className="mb-4">
          As a token of appreciation for your understanding, we offer a 10% discount on your next order. 
          Use code <span className="font-semibold">THANKYOU10</span> at checkout.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-4">
          For general inquiries or additional support, contact us at:{' '}
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">
            info@ready-set.co
          </a>
        </p>
      </section>
    </div>
  )
}