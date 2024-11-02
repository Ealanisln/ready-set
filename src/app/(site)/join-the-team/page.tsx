"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Truck, Headphones, Users } from "lucide-react"
import Link from 'next/link';

export default function JoinOurTeam() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16 pt-36">
      <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Amazing Team!</h1>
          <p className="text-xl text-gray-600">We&apos;re always looking for great talent to help us grow</p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <Truck className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Catering Deliveries</h2>
            <p className="text-gray-600 mb-4">Do you have experience in catering deliveries? Join our team and help us deliver exceptional dining experiences to our clients.</p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <Headphones className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Virtual Assistant</h2>
            <p className="text-gray-600 mb-4">Are you a talented virtual assistant? Put your skills to work and help our team stay organized and efficient.</p>
            <Button asChild>
            <Link href="/va" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 flex items-center">
            Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            </Button>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Don&apos;t see your perfect role?</h2>
          <p className="text-xl text-gray-600 mb-6">We&apos;re always on the lookout for great talent. Let us know how you can contribute!</p>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white">
            <Users className="mr-2 h-5 w-5" /> Join Our Talent Pool
          </Button>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interested? Get in Touch!</h2>
          {formSubmitted ? (
            <p className="text-green-600">Thank you for your interest! We&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input type="text" placeholder="Your Name" required />
                <Input type="email" placeholder="Your Email" required />
                <Textarea placeholder="Tell us about your experience and interests" required />
                <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800">
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}