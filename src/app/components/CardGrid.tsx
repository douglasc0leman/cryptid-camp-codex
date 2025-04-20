'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CryptidCampCard } from '../types/Card'
import { getCardArtUrl } from '../utils/getCroppedArt'

export default function CardGrid({ cards }: { cards: CryptidCampCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/card/${card.id}`}
          className="bg-white p-4 rounded shadow hover:shadow-md transform transition duration-300 ease-in-out hover:scale-105"
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

          <p className="text-sm text-gray-500">
            {[
              card.is_cryptid && 'Cryptid',
              card.is_lantern && 'Lantern',
              card.is_trail && 'Trail',
              card.is_supply && 'Supply',
              card.is_memory && 'Memory Trap',
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
      ))}
    </div>
  )
}
