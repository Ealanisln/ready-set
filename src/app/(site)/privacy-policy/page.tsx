// app/privacy-policy/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Privacy Policy | Company Name',
  description: 'Learn about how we use cookies and similar technologies on our food delivery platform.',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Welcome to Ready Set. This Privacy Policy explains how we collect, use, 
          disclose, and safeguard your information when you visit our website and use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-4">
          When you use our service, we may collect various types of information, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Personal identification information (Name, email address, phone number)</li>
          <li>Delivery address information</li>
          <li>Payment information</li>
          <li>Device and usage information</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Process and deliver your orders</li>
          <li>Send you order confirmations and updates</li>
          <li>Improve our services</li>
          <li>Communicate with you about promotions and updates</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track activity on our service 
          and hold certain information. You can instruct your browser to refuse all cookies or 
          to indicate when a cookie is being sent. For more information about our cookie usage, 
          please visit our{' '}
          <Link href="https://support.google.com/analytics/answer/6004245?hl=en" 
                className="text-blue-600 hover:text-blue-800 underline">
            Cookie Policy
          </Link>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:{' '}
          <a href="info@ready-set.co" 
             className="text-blue-600 hover:text-blue-800 underline">
            info@ready-set.co
          </a>
        </p>
      </section>
    </div>
  )
}