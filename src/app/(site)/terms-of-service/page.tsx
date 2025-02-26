// app/terms-of-service/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Ready Set Group',
  description: 'Read our terms of service to understand your rights and responsibilities when using Ready Set Group services.',
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <p className="text-sm text-gray-600 mb-8">
        Effective Date: December 4, 2024
      </p>

      <section className="mb-8">
        <p className="mb-4">
          Welcome to Ready Set Group, LLC ("we," "us," "our"). By accessing or using our website 
          [https://readysetllc.com/] (the "Site") or any of our services (the "Services"), you agree 
          to be bound by these Terms of Service ("Terms") and our Privacy Notice. Please read these 
          Terms carefully before using our Site or Services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using our Site or Services, you agree to comply with and be bound by these 
          Terms, including any future modifications. If you do not agree with these Terms, you must 
          not use the Site or Services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to update or modify these Terms at any time. Any changes will be posted 
          on this page, and the "Effective Date" at the top of these Terms will be updated accordingly. 
          We encourage you to review these Terms periodically for any updates. Your continued use of 
          the Site or Services after the posting of changes constitutes your acceptance of such changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Use of the Site and Services</h2>
        <p className="mb-4">
          You agree to use the Site and Services in accordance with applicable laws and regulations. 
          You may not use the Site or Services for any unlawful or prohibited activities, including 
          but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violating any applicable local, state, national, or international law.</li>
          <li>Transmitting harmful, offensive, or illegal content.</li>
          <li>Engaging in any conduct that disrupts or interferes with the functionality of the Site or Services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
        <p className="mb-4">
          To access certain features of our Services, you may need to create an account. You agree to 
          provide accurate, current, and complete information during the registration process. You are 
          responsible for maintaining the confidentiality of your account credentials and for all 
          activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
        <p className="mb-4">
          All content on the Site, including but not limited to text, graphics, logos, images, and 
          software, is the property of Ready Set Group, LLC or its licensors and is protected by 
          copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, 
          or otherwise use any content from the Site without our express permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="mb-4 uppercase">
          To the maximum extent permitted by law, Ready Set Group, LLC, its affiliates, officers, 
          employees, agents, or licensors shall not be liable for any indirect, incidental, special, 
          or consequential damages arising from or related to the use or inability to use the Site 
          or Services, even if we have been advised of the possibility of such damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
        <p className="mb-4">
          These Terms and any disputes arising from or related to them will be governed by and 
          construed in accordance with the laws of the State of California, without regard to its 
          conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts 
          located in San Francisco, California for any legal actions or proceedings related to these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">If you have any questions or concerns regarding these Terms of Service, please contact us at:</p>
        <address className="not-italic">
          Ready Set Group, LLC<br />
          166 Geary St. STE 1500 #1937<br />
          San Francisco, CA 94108<br />
          <a href="tel:+14152266872" className="text-blue-600 hover:text-blue-800">(415) 226-6872</a><br />
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:text-blue-800">info@ready-set.co</a>
        </address>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Notice</h2>
        <p className="mb-4">
          By using the Site or Services, you also agree to our{' '}
          <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
            Privacy Notice
          </Link>
          , which explains how we collect, use, and protect your personal data. Please review the 
          Privacy Notice for more information.
        </p>
      </section>
    </div>
  )
}