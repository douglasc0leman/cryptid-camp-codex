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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-4 auto-rows-fr min-h-[60vh]">
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
            className={`w-full h-[320px] flex flex-col cursor-pointer p-2 rounded shadow hover:shadow-md transform transition duration-300 ease-in-out hover:scale-105`}
            style={{ backgroundColor: bg }}
          >
            <div className="w-full h-[220px] relative overflow-hidden rounded mb-2 bg-gray-100 flex items-center justify-center">
              {card.image_url ? (
                <div
                  className={`relative w-full h-full transition-transform duration-300 ${
                    shouldRotate ? 'rotate-[-90deg] scale-[1.4]' : ''
                  }`}
                >
                  <Image
                    src={getCardArtUrl(card.image_url, card)}
                    alt={card.name}
                    fill
                    className="object-cover w-full h-full"
                    sizes="100vw"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
            <h2 className={`text-lg md:text-xl font-bold leading-tight truncate ${text}`}>{card.name}</h2>

            <p className={`text-base leading-snug truncate ${text}`}>
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
