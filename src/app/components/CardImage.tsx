'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function CardImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={400}
        height={560}
        onLoad={() => setIsLoading(false)}
        className={`rounded object-cover w-full transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}
