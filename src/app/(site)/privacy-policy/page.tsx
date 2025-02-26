import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Notice | Ready Set Group',
  description: 'Learn about how Ready Set Group collects, uses, and protects your personal data.',
}

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 pt-40 pb-10">
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
          <li><strong>Personal Data:</strong> Any information that can be used to identify you or from which you can be identified. This includes, but is not limited to, your name, nationality, telephone number, email address, government-issued identification numbers, financial information, health information, and other personal identifiers.</li>
          <li><strong>Processing:</strong> Any action or set of actions taken with your personal data, such as collection, use, storage, or sharing.</li>
          <li><strong>Cookies:</strong> Small data files placed on your device that help us enhance your experience on our website.</li>
          <li><strong>Service Providers:</strong> Third-party vendors that assist in delivering services on our behalf.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Identifiable Information (PII):</strong> Name, email address, phone number, company name, and job title.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website, such as IP address, browser type, and pages visited.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> Data collected through cookies and similar technologies to enhance your user experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use the information collected for the following purposes:</p>
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
          <li><strong>Service Providers:</strong> Third-party vendors who assist in delivering our services.</li>
          <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
          <li><strong>Third-Party Platforms:</strong> Trusted third-party partners (e.g., marketing platforms, payment processors, analytics providers) solely for the purpose of delivering services to you.</li>
          <li><strong>Data Processors:</strong> Third-party processors who help us deliver services, like cloud hosting providers or customer support systems. These processors are required to process your data in accordance with this Privacy Notice.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Consent</h2>
        <p className="mb-4">
          By using our services or website, you consent to the collection and processing of your personal data as described in this Privacy Notice. 
          For marketing communications, we will only send you emails and updates if you have opted in to receive them. 
          You may withdraw your consent at any time by contacting us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
        <p className="mb-4">
          We retain your personal data only as long as necessary to fulfill the purposes outlined in this notice or to comply with legal obligations. 
          Different types of data are retained for different periods:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Marketing-related data:</strong> Retained for 3 years</li>
          <li><strong>Contract-related data:</strong> Retained for 7 years</li>
        </ul>
        <p className="mt-4">After the retention period, your data will be deleted or anonymized.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Transparency Regarding Automated Decision-Making</h2>
        <p className="mb-4">
          We may use automated decision-making processes, such as analyzing your interactions with our services or website to provide personalized content or offers. 
          You have the right to object to such processing by contacting us using the information provided below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Legal Basis for Data Processing (Under GDPR)</h2>
        <p className="mb-4">We process your personal data based on the following legal grounds:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Consent:</strong> For sending marketing communications</li>
          <li><strong>Contractual Necessity:</strong> To fulfill services you have requested</li>
          <li><strong>Legal Obligations:</strong> To comply with tax and financial regulations</li>
          <li><strong>Legitimate Interests:</strong> For operational efficiency, improving services, or protecting our rights</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Subject Requests Handling</h2>
        <p className="mb-4">
          We strive to respond to all requests related to your personal data within [time frame, e.g., 30 days]. 
          In cases where we cannot comply with your request, we will provide an explanation of the reasons. 
          This includes the right to access, correct, or delete your personal data, or to object to certain types of processing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Non-Disclosure of Sensitive Data</h2>
        <p className="mb-4">
          We do not collect sensitive personal data unless necessary for the provision of services. 
          We do not require you to provide sensitive information such as health details, racial or ethnic background, or political opinions. 
          If we do collect such data, we will obtain your explicit consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Privacy Impact Assessments</h2>
        <p className="mb-4">
          We regularly conduct privacy impact assessments to evaluate and mitigate risks associated with processing personal data. 
          This helps us ensure compliance with privacy laws and protects your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies to analyze traffic, enhance your experience, and provide personalized content. 
          You can manage cookie preferences through your browser settings.
        </p>
        <p className="mb-4">
          Upon your first visit to our website, you will be presented with a cookie consent banner, asking you to accept or customize your cookie preferences. 
          You may change your cookie preferences at any time through the settings provided on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
        <p className="mb-4">
          If we transfer your personal data outside your country of residence, we ensure that appropriate safeguards are in place to protect your information, 
          in compliance with applicable data protection laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Children’s Privacy</h2>
        <p className="mb-4">
          We do not knowingly collect or solicit personal data from children under the age of 13. 
          If we learn that we have collected personal data from a child under age 13, we will take steps to delete that information as soon as possible.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Updates to This Privacy Notice</h2>
        <p className="mb-4">
          We may update this Privacy Notice from time to time. The latest version will always be available on our website, 
          and significant changes will be communicated to you directly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          For privacy-related inquiries or concerns, please contact our Data Protection Officer (DPO) at:
        </p>
        <address className="not-italic mb-4">
          Ready Set Group, LLC<br />
          166 Geary St. STE 1500 #1937<br />
          San Francisco, CA 94108<br />
          <a 
            href="tel:+14152266872" 
            className="text-blue-600 hover:text-blue-800"
            aria-label="Call us at (415) 226-6872"
          >
            (415) 226-6872
          </a><br />
          <a 
            href="mailto:info@ready-set.co" 
            className="text-blue-600 hover:text-blue-800"
            aria-label="Email us at info@ready-set.co"
          >
            info@ready-set.co
          </a>
        </address>
        <p className="italic mt-4">
          Always Ready! We’re your partner in business success, providing seamless solutions and exceptional service.
        </p>
      </section>
    </main>
  )
}