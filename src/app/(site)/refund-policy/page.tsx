// app/refund-policy/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Ready Set Group',
  description: 'Learn about our refund policies for catering delivery and virtual assistance services.',
}

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <section className="mb-8">
        <p className="mb-6">
          At Ready Set, we prioritize exceptional service, whether we're delivering catered meals or 
          supporting your business with skilled virtual assistants. Your satisfaction is our top priority. 
          If you're not completely satisfied with your experience, we'll make it right.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Catering Delivery Refund Policy</h2>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Eligibility for Refunds</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will issue a refund for orders with incorrect or missing items.</li>
            <li>We will process refunds for late deliveries exceeding 30 minutes past the scheduled delivery time (excluding delays caused by traffic, weather, or other unforeseeable circumstances).</li>
            <li>We will address food quality issues reported within 24 hours of delivery.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Refund Process</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submit a refund request within 48 hours of delivery.</li>
            <li>Provide order details and any relevant documentation (photos, receipts).</li>
            <li>We may issue refunds as a credit to your account, a replacement delivery, or a monetary refund based on the issue.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Exclusions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will not issue refunds for customer order errors (e.g., incorrect address or order changes made after confirmation).</li>
            <li>We will not process refunds for situations outside our control (e.g., natural disasters, accidents, or unpreventable disruptions).</li>
            <li>We may not refund custom orders, special dietary requests, or orders placed with less than 48 hours' notice.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Virtual Assistance Refund Policy</h2>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Eligibility for Refunds</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will issue a refund if work is not completed to agreed specifications.</li>
            <li>We will address errors in tasks caused directly by a Ready Set Virtual Assistant.</li>
            <li>We require disputes regarding services to be reported within 7 business days of task completion.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Refund Process</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Submit a written refund request with supporting documentation.</li>
            <li>We will evaluate and respond within 2-3 business days.</li>
            <li>Refunds may include task credits or partial monetary refunds, depending on the issue.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Subscription-Based Services</h3>
          <p className="mb-4">
            If you subscribe to a Ready Set Virtual Assistant plan and wish to cancel before the billing 
            cycle ends, we offer a pro-rated refund based on the unused portion of your subscription.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">How to Request a Refund</h2>
        <p className="mb-4">Email our Customer Support Team at{' '}
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">
            info@ready-set.co
          </a> with:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Your order/task ID.</li>
          <li>A detailed explanation of the issue.</li>
          <li>Supporting evidence, such as photos or communications.</li>
        </ul>
        <p className="mb-4">
          For urgent refund requests, contact us directly at{' '}
          <a href="tel:+14152266872" className="text-blue-600 hover:text-blue-800">
            (415) 226-6872
          </a>.
        </p>
        <p className="mb-4">
          We will review your request promptly and acknowledge receipt within 1 business day. 
          We will process refunds within 7-10 business days, depending on your payment method.
        </p>
      </section>

      <section className="mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Special Offer</h2>
          <p className="mb-4">
            As a token of appreciation for your understanding, we'd like to offer you a 10% discount 
            on your next order with us. Simply use the code <span className="font-mono bg-blue-100 px-2 py-1 rounded">THANKYOU10</span> at 
            checkout.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">For general inquiries or additional support:</p>
        <address className="not-italic">
          Ready Set Group, LLC<br />
          166 Geary St. STE 1500 #1937<br />
          San Francisco, CA 94108<br />
          <a href="tel:+14152266872" className="text-blue-600 hover:text-blue-800">(415) 226-6872</a><br />
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">info@ready-set.co</a>
        </address>
      </section>
    </div>
  )
}