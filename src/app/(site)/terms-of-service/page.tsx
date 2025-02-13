// app/terms-of-service/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Ready Set Group',
  description: 'Learn about the terms and conditions that apply to Ready Set Group services.',
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="text-sm text-gray-600 mb-8">
        Effective Date: December 4, 2024
      </div>

      <section className="mb-8">
        <p className="mb-4">
          Welcome to Ready Set Group, LLC ("we," "us," "our"). By accessing or using our website [https://readysetllc.com/] (the "Site") 
          or any of our services (the "Services"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Notice. 
          Please read these Terms carefully before using our Site or Services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using our Site or Services, you agree to comply with and be bound by these Terms, including any future modifications. 
          If you do not agree with these Terms, you must not use the Site or Services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to update or modify these Terms at any time. Any changes will be posted on this page, and the "Effective Date" 
          at the top of these Terms will be updated accordingly. We encourage you to review these Terms periodically for any updates. 
          Your continued use of the Site or Services after the posting of changes constitutes your acceptance of such changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Use of the Site and Services</h2>
        <p className="mb-4">
          You agree to use the Site and Services in accordance with applicable laws and regulations. You may not use the Site or Services 
          for any unlawful or prohibited activities, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Violating any applicable local, state, national, or international law.</li>
          <li className="mb-2">Transmitting harmful, offensive, or illegal content.</li>
          <li className="mb-2">Engaging in any conduct that disrupts or interferes with the functionality of the Site or Services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
        <p className="mb-4">
          To access certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete 
          information during the registration process. You are responsible for maintaining the confidentiality of your account credentials 
          and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding these Terms of Service, please contact us at:
        </p>
        <div className="pl-4 border-l-4 border-gray-200">
          <p>Ready Set Group, LLC</p>
          <p>166 Geary St. STE 1500 #1937</p>
          <p>San Francisco, CA 94108</p>
          <p>(415) 226-6872</p>
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">
            info@ready-set.co
          </a>
        </div>
      </section>

      {/* Additional sections for Intellectual Property, Third-Party Links, etc. can be added following the same pattern */}
    </div>
  )
}