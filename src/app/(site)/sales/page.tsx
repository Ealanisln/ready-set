// src/app/(site)/sales/page.tsx
import { Metadata } from 'next'
import VaHoursSeller from '@/components/VirtualAssistant/Sales/VAHoursSeller'

export const metadata: Metadata = {
  title: 'Virtual Assistant Packages | Expert VA Services',
  description: 'Choose from our flexible virtual assistant packages. Get professional VA support to streamline your business operations and boost productivity.',
  openGraph: {
    title: 'Virtual Assistant Packages | Expert VA Services',
    description: 'Transform your business with our expert virtual assistant services. Choose the perfect package for your needs and start delegating today.',
    type: 'website',
  },
}

export default function SalesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 pt-40">
      <VaHoursSeller />
    </main>
  )
}