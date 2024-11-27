'use client'

import { useState, useEffect } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getYouTubeId = (url: string): string => {
    // Handle direct ID
    if (url.length === 11) return url

    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]{11})/,
      /^[^#&?]{11}$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    // If no match found, log for debugging
    console.warn('Could not extract YouTube ID from:', url)
    return url
  }

  const youtubeId = getYouTubeId(videoUrl)

  useEffect(() => {
    // Verify we have a valid ID
    if (youtubeId.length !== 11) {
      setError('Invalid YouTube video ID')
      setIsLoading(false)
    } else {
      setError(null)
    }
  }, [youtubeId])

  return (
    <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : (
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      )}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  )
}