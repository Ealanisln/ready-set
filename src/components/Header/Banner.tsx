'use client'

import { useState, useEffect } from 'react'
import { X, Clock, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PromotionalPricingBanner() {
  const [timeLeft, setTimeLeft] = useState(15 * 24 * 60 * 60) // 15 days in seconds
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const days = Math.floor(time / (24 * 3600))
    const hours = Math.floor((time % (24 * 3600)) / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className="relative bg-[#fbce04] text-black p-3 md:p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <Clock className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">
            Promo Ends: {formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-lg font-bold">Promotional Pricing Chart</span>
          <span className="text-sm font-medium">October 1 - October 15</span>
          <Button className="bg-[#ffc61a] text-black hover:bg-[#e6b118] text-sm px-4 py-1 flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Chart
          </Button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 text-black hover:text-gray-700"
          aria-label="Close promotion banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}