'use client'

import { useState, useEffect } from 'react'
import { X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Component() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 hours in seconds
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 md:p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50"> 
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center mb-2 sm:mb-0">
        <Clock className="w-5 h-5 mr-2 text-amber-400" /> 
        <span className="text-sm font-semibold">
          Offer Ends: {formatTime(timeLeft)}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-base font-bold text-amber-400"> 
          Limited Time: 20% Off!
        </span>
        <Button className="bg-amber-400 text-gray-800 hover:bg-amber-300 text-sm px-4 py-1"> 
          Claim Now
        </Button>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-white hover:text-amber-400" 
        aria-label="Close promotion banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
  )
}