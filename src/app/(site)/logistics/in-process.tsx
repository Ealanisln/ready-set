import { client } from '@/sanity/lib/client'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - Under Development | Company Name',
  description: 'Our privacy policy page is currently being developed.',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-40 pb-10 text-center">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8" role="alert">
        <p className="font-bold text-lg">🚧 Page Under Development 🚧</p>
        <p className="text-sm">Our privacy policy is currently being prepared and will be available soon.</p>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-gray-700">
        Privacy Policy
      </h1>

      <div className="bg-white shadow-md rounded-lg p-8">
        <p className="text-gray-600 mb-6">
          We are actively working on our comprehensive privacy policy to ensure transparency 
          and protect our users' data. Our team is carefully crafting a detailed document 
          that will outline:
        </p>

        <ul className="list-disc list-inside text-left text-gray-600 mb-6 max-w-md mx-auto">
          <li>How we collect and use your information</li>
          <li>Our data protection practices</li>
          <li>Your rights and our commitments</li>
          <li>Cookie and tracking policies</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            <strong>Stay Tuned:</strong> We will publish our full privacy policy very soon.
          </p>
        </div>

        <p className="text-sm text-gray-500 italic">
          For any immediate questions, please contact us at{' '}
          <a href="mailto:info@ready-set.co" className="text-blue-600 hover:underline">
            info@ready-set.co
          </a>
        </p>
      </div>
    </div>
  )
}
