import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image';

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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Mobile Banner */}
      <div className="sm:hidden">
        <Image
          src="/images/footer/mobile-banner.png"
          alt="Mobile Promotion Banner"
          className="w-full h-auto"
          width={613}
          height={88}
          layout="responsive"
        />
      </div>
      
      {/* Desktop Banner */}
      <div className="hidden sm:block">
        <Image
          src="/images/footer/desktop-banner.png"
          alt="Desktop Promotion Banner"
          className="w-full h-auto"
          width={1274}
          height={158}
          layout="responsive"
        />
      </div>
      
      {/* Timer Overlay */}
      {/* <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        <span className="text-sm font-semibold">
          {formatTime(timeLeft)}
        </span>
      </div> */}
      
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-white hover:text-amber-400 bg-black bg-opacity-50 rounded-full p-1"
        aria-label="Close promotion banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}