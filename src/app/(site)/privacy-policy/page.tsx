// app/privacy-policy/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Notice | Ready Set Group',
  description: 'Learn about how Ready Set Group collects, uses, and protects your personal data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Privacy Notice</h1>
      
      <p className="text-sm text-gray-600 mb-8">
        Effective Date: December 4, 2024
      </p>

      <section className="mb-8">
        <p className="mb-4">
          Ready Set Group, LLC ("we," "us," "our") values your privacy and is committed to protecting your personal data. 
          This Privacy Notice explains how we collect, use, disclose, and safeguard your information when you engage with 
          our services or visit our website. Please take a moment to review this information and contact us if you have any questions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Definitions</h2>
        <ul className="space-y-4">
          <li><strong>Personal Data:</strong> Any information that can be used to identify you or from which you can be identified. 
          This includes, but is not limited to, your name, nationality, telephone number, email address, government-issued 
          identification numbers, financial information, health information, and other personal identifiers.</li>
          <li><strong>Processing:</strong> Any action or set of actions taken with your personal data, such as collection, 
          use, storage, or sharing.</li>
          <li><strong>Cookies:</strong> Small data files placed on your device that help us enhance your experience on our website.</li>
          <li><strong>Service Providers:</strong> Third-party vendors that assist in delivering services on our behalf.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal Identifiable Information (PII): Name, email address, phone number, company name, and job title.</li>
          <li>Usage Data: Information about how you interact with our website, such as IP address, browser type, and pages visited.</li>
          <li>Cookies and Tracking Technologies: Data collected through cookies and similar technologies to enhance your user experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide, operate, and improve our services.</li>
          <li>To communicate with you about our offerings, updates, and promotions.</li>
          <li>To personalize your experience with our website and services.</li>
          <li>To comply with legal obligations and enforce our terms of service.</li>
          <li>To conduct market research and ensure our services are relevant to your needs.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Share Your Information</h2>
        <p className="mb-4">We do not sell or rent your personal information. We may share your information with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Service Providers: Third-party vendors who assist in delivering our services.</li>
          <li>Legal Authorities: When required by law or to protect our legal rights.</li>
          <li>Business Transfers: In the event of a merger, acquisition, or sale of assets.</li>
          <li>Third-Party Platforms: We may share your personal data with trusted third-party partners for service delivery.</li>
          <li>Data Processors: Third-party processors who help us deliver services, like cloud hosting providers or customer support systems.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          For privacy-related inquiries or concerns, please contact our Data Protection Officer (DPO) at:
        </p>
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