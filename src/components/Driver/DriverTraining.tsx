'use client'

import { useState, useEffect } from 'react'
import { VideoPlayer } from "./VideoPlayer"
import { CheckCircle2, Clock } from 'lucide-react'

interface TrainingVideo {
  id: string
  title: string
  description: string
  videoUrl: string
}

const trainingVideos: TrainingVideo[] = [
  {
    id: "1",
    title: "Safe Driving Techniques",
    description: "Learn essential safe driving techniques for delivery drivers.",
    videoUrl: "KyxprzEto3Y",
  },
  {
    id: "2",
    title: "Efficient Route Planning",
    description: "Master the art of planning efficient delivery routes.",
    videoUrl: "KyxprzEto3Y",
  },
  {
    id: "3",
    title: "Customer Service Excellence",
    description: "Discover how to provide excellent customer service during deliveries.",
    videoUrl: "KyxprzEto3Y",
  },
]

export function DeliveryDriverTraining() {
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load completed videos from localStorage if available
    const saved = localStorage.getItem('completedVideos')
    if (saved) {
      setCompletedVideos(new Set(JSON.parse(saved)))
    }
  }, [])

  const toggleVideoCompletion = (videoId: string) => {
    setCompletedVideos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      // Save to localStorage
      localStorage.setItem('completedVideos', JSON.stringify([...newSet]))
      return newSet
    })
  }

  const getProgress = () => {
    return Math.round((completedVideos.size / trainingVideos.length) * 100)
  }

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 py-12">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Delivery Driver Training
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Complete all videos to finish your training
            </p>
          </div>
          <div className="rounded-full bg-white p-4 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{getProgress()}%</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trainingVideos.map((video) => {
            const isCompleted = completedVideos.has(video.id)
            
            return (
              <div
                key={video.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative">
                  <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
                  <div className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {video.title}
                    </h2>
                  </div>
                  <p className="mb-4 text-gray-600">{video.description}</p>
                  <button
                    onClick={() => toggleVideoCompletion(video.id)}
                    className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}