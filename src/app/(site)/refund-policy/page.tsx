// app/refund-policy/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Company Name',
  description: 'Learn about our refund policy and how we handle refunds for our food delivery services.',
}

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          At Ready Set, we strive to ensure that you are completely satisfied with our food delivery services. 
          However, if you are not satisfied with your order, we offer a refund policy to address your concerns. 
          Please read the following information carefully to understand how refunds are processed.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Eligibility for Refunds</h2>
        <p className="mb-4">
          Refunds may be issued under the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>If the order was not delivered.</li>
          <li>If the order was delivered incorrectly (e.g., wrong items or missing items).</li>
          <li>If the food delivered was of unsatisfactory quality (e.g., spoiled or damaged).</li>
        </ul>
        <p className="mb-4">
          Refunds are not available for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Change of mind after placing the order.</li>
          <li>Minor discrepancies in food preparation (e.g., spice levels, personal preferences).</li>
          <li>Delays in delivery due to external factors such as traffic or weather.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
        <p className="mb-4">
          If you believe you are eligible for a refund, please follow these steps:
        </p>
        <ol className="list-decimal pl-6 mb-4">
          <li>Contact our customer support team within 24 hours of receiving your order.</li>
          <li>Provide your order number and a detailed explanation of the issue.</li>
          <li>If necessary, provide photos or other evidence to support your claim.</li>
        </ol>
        <p className="mb-4">
          Our team will review your request and respond within 2-3 business days.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Refund Processing</h2>
        <p className="mb-4">
          Once your refund request is approved, the refund will be processed as follows:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Refunds will be issued to the original payment method used for the order.</li>
          <li>Processing times may vary depending on your bank or payment provider (typically 5-10 business days).</li>
          <li>If you paid with a gift card or promotional credit, the refund will be issued as store credit.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our Refund Policy, please contact us at:{' '}
          <a href="mailto:info@ready-set.co" 
             className="text-blue-600 hover:text-blue-800 underline">
            info@ready-set.co
          </a>
        </p>
      </section>
    </div>
  )
}