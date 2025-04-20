'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CryptidCampCard } from '../types/Card'
import { getCardArtUrl } from '../utils/getCroppedArt'

export default function CardGrid({ cards }: { cards: CryptidCampCard[] }) {
  const cabinColorMap: Record<string, { bg: string; text: string }> = {
    obsidian: { bg: '#1a1a1a', text: 'text-white' },
    quartz: { bg: '#f5f5f4', text: 'text-gray-900' },
    corallium: { bg: '#f87171', text: 'text-gray-900' },
    lapis: { bg: '#4aa4da', text: 'text-white' },
    meteorite: { bg: '#34d399', text: 'text-gray-900' },
    fluorite: { bg: '#955ea5', text: 'text-gray-900' },
    malachite: { bg: '#059669', text: 'text-white' },
    fulgurite: { bg: '#81e6d9', text: 'text-gray-900' },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const cabinKey = card.cabin?.toLowerCase() ?? ''
        const { bg, text } = cabinColorMap[cabinKey] || {
          bg: '#e2e8f0', // fallback bg
          text: 'text-gray-900',
        }

        return (
          <Link
            key={card.id}
            href={`/card/${card.id}`}
            className={`p-4 rounded shadow hover:shadow-md transform transition duration-300 ease-in-out hover:scale-105 ${text}`}
            style={{ backgroundColor: bg }}
          >
            <div className="w-full h-48 relative overflow-hidden rounded mb-3 bg-gray-100">
              {card.image_url ? (
                <Image
                  src={getCardArtUrl(card.image_url)}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
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
                card.is_unique && 'Unique'
              ]
                .filter(Boolean)
                .join(' • ')}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
