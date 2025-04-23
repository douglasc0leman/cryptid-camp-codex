'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CryptidCampCard } from '../types/Card'
import { getCardArtUrl } from '../utils/getCroppedArt'
import { cabinColorMap } from '../utils/cabinStyles'

export default function CardGrid({
  cards,
  currentPage,
  onCardClickStart,
}: {
  cards: CryptidCampCard[]
  currentPage: number
  onCardClickStart: () => void
}) {
  const router = useRouter()

  const handleCardClick = (card: CryptidCampCard) => {
    const cabinKey = card.cabin?.toLowerCase() ?? ''
    const { bg, text } = cabinColorMap[cabinKey] || {
      bg: '#e2e8f0',
      text: 'text-gray-900',
    }

    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      bg,
      text,
    })

    const path = `/card/${card.id}?${queryParams.toString()}`

    onCardClickStart()
    router.push(path)
  }

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 min-h-[60vh]">
{cards.map((card) => {
        const cabinKey = card.cabin?.toLowerCase() ?? ''
        const { bg, text } = cabinColorMap[cabinKey] || {
          bg: '#e2e8f0',
          text: 'text-gray-900',
        }

        return (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`w-full cursor-pointer p-4 rounded shadow hover:shadow-md transform transition duration-300 ease-in-out hover:scale-105 ${text}`}
            style={{ backgroundColor: bg }}
          >
          <div className="w-full h-42 sm:h-48 md:h-52 xl:h-56 relative overflow-hidden rounded mb-3 bg-gray-100">

              {card.image_url ? (
                <Image
                  src={getCardArtUrl(card.image_url)}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 16vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold">{card.name}</h2>

            <p className="text-sm opacity-90">
              {[
                card.is_cryptid && 'Cryptid',
                card.is_lantern && 'Lantern',
                card.is_trail && 'Trail',
                card.is_supply && 'Supply',
                card.is_memory && 'Memory',
                card.is_trap && 'Trap',
                card.cabin,
                card.is_common && 'Common',
                card.is_uncommon && 'Uncommon',
                card.is_rare && 'Rare',
                card.is_unique && 'Unique',
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          </div>
        )
      })}
    </div>
  )
}
