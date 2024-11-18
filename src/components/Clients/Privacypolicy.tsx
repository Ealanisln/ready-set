"use client";

// app/cookie-policy/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Privacy Policy | Company Name',
  description: 'Learn about how we use cookies and similar technologies on our food delivery platform.',
}

const CookiePolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cookie Privacy Policy</h1>
      
      <div className="space-y-8">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700">
            This Cookie Privacy Policy explains how we use cookies and similar technologies 
            on our food delivery website and mobile applications.
          </p>
        </section>

        {/* What Are Cookies Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
          <p className="text-gray-700">
            Cookies are small text files stored on your device when you visit our website. 
            They help us remember your preferences and improve your browsing experience.
          </p>
        </section>

        {/* Types of Cookies Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
          
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div>
              <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Required for basic website functionality</li>
                <li>Enable secure checkout and payment processing</li>
                <li>Maintain your session and shopping cart</li>
                <li>Cannot be disabled</li>
              </ul>
            </div>

            {/* Performance Cookies */}
            <div>
              <h3 className="text-xl font-medium mb-2">Performance Cookies</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Collect anonymous data about website usage</li>
                <li>Help us understand how customers use our services</li>
                <li>Track page visits and traffic sources</li>
                <li>Analyze delivery tracking performance</li>
              </ul>
            </div>

            {/* Functionality Cookies */}
            <div>
              <h3 className="text-xl font-medium mb-2">Functionality Cookies</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Remember your preferences (delivery addresses, payment methods)</li>
                <li>Store your login information</li>
                <li>Customize your experience based on location</li>
                <li>Save language and regional preferences</li>
              </ul>
            </div>

            {/* Marketing Cookies */}
            <div>
              <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Help us deliver relevant advertisements</li>
                <li>Track the effectiveness of our marketing campaigns</li>
                <li>Remember your food preferences</li>
                <li>Enable social media sharing features</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            We partner with third-party services that may place cookies on your device:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Payment processors</li>
            <li>Analytics providers</li>
            <li>Marketing partners</li>
            <li>Social media platforms</li>
            <li>Delivery tracking services</li>
          </ul>
        </section>

        {/* Your Cookie Choices Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Cookie Choices</h2>
          <p className="text-gray-700 mb-4">
            You can control cookies through your browser settings:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Block all cookies</li>
            <li>Delete existing cookies</li>
            <li>Allow only essential cookies</li>
            <li>Accept all cookies</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Please note that blocking certain cookies may impact the functionality of our service.
          </p>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about our Cookie Policy, please contact us at:
          </p>
          <div className="text-gray-700 space-y-2">
            <p>Email: privacy@company.com</p>
            <p>Phone: [phone number]</p>
            <p>Address: [physical address]</p>
          </div>
        </section>

        {/* Compliance Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Compliance</h2>
          <p className="text-gray-700 mb-4">
            This policy complies with applicable US privacy laws, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>California Privacy Rights Act (CPRA)</li>
            <li>Other applicable state privacy laws</li>
          </ul>
        </section>

        {/* Last Updated */}
        <p className="text-sm text-gray-500 mt-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default CookiePolicyPage