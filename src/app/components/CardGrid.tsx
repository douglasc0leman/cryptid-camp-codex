'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CryptidCampCard } from '../types/Card'
import { cabinColorMap } from '../utils/cabinStyles'
import { useState } from 'react'

export default function CardGrid({
  cards,
  onCardClickStart,
  filters,
}: {
  cards: CryptidCampCard[]
  currentPage: number
  onCardClickStart: () => void
  filters: {
    type: string
    cabin: string
    rarity: string
    set: string
    taxa: string[]
    weather: string[]
    traits: string[]
    search: string
    effect: string
    costRange: [number, number]
  }
}) {
  const router = useRouter()
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const handleCardClick = (card: CryptidCampCard) => {
    const cabinKey = card.cabin?.toLowerCase() ?? ''
    const queryParams = new URLSearchParams()
    if (filters.type) queryParams.set('type', filters.type)
    if (filters.cabin) queryParams.set('cabin', filters.cabin)
    if (filters.rarity) queryParams.set('rarity', filters.rarity)
    if (filters.set) queryParams.set('set', filters.set)
    if (filters.taxa.length > 0) queryParams.set('taxa', filters.taxa.join(','))
    if (filters.weather.length > 0) queryParams.set('weather', filters.weather.join(','))
    if (filters.traits.length > 0) queryParams.set('traits', filters.traits.join(','))
    if (filters.search) queryParams.set('search', filters.search)
    if (filters.effect) queryParams.set('effect', filters.effect)
    queryParams.set('costMin', String(filters.costRange[0]))
    queryParams.set('costMax', String(filters.costRange[1]))
    queryParams.set('bg', cabinKey)
    const path = `/card/${card.id}?${queryParams.toString()}`

    onCardClickStart()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      sessionStorage.setItem('currentCardId', card.id);
    }

    router.push(path)
  }

  function getOptimizedCloudinaryUrl(originalUrl: string, width = 300) {
    if (!originalUrl.includes('res.cloudinary.com')) return originalUrl;
  
    return originalUrl.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }

  return (
    <div
      className="grid gap-4 px-2 sm:px-4 auto-rows-[1fr] transition-all duration-300"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {cards.map((card) => {
        const cabinKey = card.cabin?.toLowerCase() ?? ''
        const { bg, text } = cabinColorMap[cabinKey] || {
          bg: '#e2e8f0',
          text: 'text-gray-900',
        }

        const shouldRotate =
          card.is_trail || (card.is_supply && card.name.toLowerCase().includes('cabin'))

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`relative transition-transform duration-300 ease-in-out w-full aspect-[2/3] flex flex-col cursor-pointer p-2 rounded shadow hover:shadow-lg hover:scale-105 ${
                shouldRotate ? 'hover:rotate-[-90deg] hover:z-[1000]' : ''
              }`}
              style={{
                background: bg,
                transformOrigin: 'center center',
              }}
            >
              <div className="relative w-full h-full rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {!isImageLoaded && (
                        <div className="w-full h-[320px] flex flex-col p-2 rounded shadow bg-gray-200 animate-pulse">
                        <div className="w-full h-[220px] rounded bg-gray-300 mb-2" />
                        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
                        <div className="h-3 w-1/2 bg-gray-300 rounded" />
                      </div>
                )}
                {card.watermark_url && (
                  <Image
                    src={getOptimizedCloudinaryUrl(card.watermark_url, 300)}
                    alt={card.name}
                    fill
                    unoptimized
                    className={`object-cover transition-opacity duration-300 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                )}
              </div>
            </div>
          );
      })}
    </div>
  )
}