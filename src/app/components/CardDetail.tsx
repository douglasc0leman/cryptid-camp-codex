'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CryptidCampCard } from '@/app/types/Card'
import CardImage from '@/app/components/CardImage'
import { Search } from 'lucide-react'

export default function CardDetail({ card }: { card: CryptidCampCard }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'
  const bg = searchParams.get('bg') ?? '#ffffff'
  const textClass = searchParams.get('text') ?? 'text-gray-800'

  const cabin = card.cabin?.toLowerCase() || ''
  const needsDarkText =
    ['#eaf4ff', '#edf2f7', '#ffffff'].includes(bg.toLowerCase()) ||
    ['meteorite', 'corallium', 'gem', 'fulgurite', 'quartz'].includes(cabin)

  const badgeMap: Record<string, string> = {
    Lapis: '/images/lapis.png',
    Obsidian: '/images/obsidian.png',
    Quartz: '/images/quartz.png',
    Corallium: '/images/corallium.png',
    Meteorite: '/images/meteorite.png',
    Fluorite: '/images/fluorite.png',
    Malachite: '/images/malachite.png',
    Fulgurite: '/images/fulgurite.png',
  }

  const badgeSrc = badgeMap[card.cabin!]
  const taxons = card.taxon?.split(' ') ?? []

  return (
    <div className="min-h-screen relative bg-gray-100 p-6 md:p-12 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

      <div
        className={`relative z-20 max-w-6xl mx-auto shadow-md rounded-lg overflow-hidden md:flex ${textClass}`}
        style={{ backgroundColor: bg }}
      >
        <div className="md:w-1/3 p-6 flex items-center justify-center border-r border-gray-200">
          <button onClick={() => setIsModalOpen(true)} className="focus:outline-none">
            <div className="relative group cursor-zoom-in transition-transform duration-200 transform hover:scale-105">
              <CardImage src={card.image_url} alt={card.name} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Search className="w-8 h-8 text-white" />
              </div>
            </div>
          </button>
        </div>

        <div className="md:w-2/3 p-6 flex flex-col justify-between min-h-[600px] relative">
          <div className="space-y-4">
            {badgeSrc && (
              <div className="absolute top-4 right-4 flex flex-col items-center">
                <Image
                  src={badgeSrc}
                  alt={`${card.cabin} badge`}
                  width={96}
                  height={96}
                />
                <span className={`mt-2 text-lg font-extrabold tracking-wide uppercase ${textClass}`}>
                  {card.cabin}
                </span>
              </div>
            )}

            {/* Name & Cost */}
            <div className="flex items-start justify-between gap-4">
              {card.cost !== null && (
                <div className="relative group w-14 h-14 shrink-0">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center font-extrabold text-2xl leading-none shadow border transition-transform duration-200 group-hover:scale-110 ${needsDarkText
                        ? 'bg-gray-200 text-gray-800 border-gray-300'
                        : 'bg-white/20 text-white border-white/30'
                      }`}
                  >
                    {card.cost}
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-md whitespace-nowrap">
                    Requires {card.cost} Vision to play
                  </div>
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold leading-tight">
                  {card.name}{' '}
                  <span className="text-lg font-medium opacity-80">
                    ({card.is_cryptid
                      ? 'Cryptid'
                      : card.is_lantern
                        ? 'Lantern'
                        : card.is_trail
                          ? 'Trail'
                          : card.is_memory
                            ? 'Memory'
                            : card.is_trap
                              ? 'Trap'
                              : card.is_supply
                                ? 'Supply'
                                : 'Other'})
                  </span>
                </h1>
                {card.sub_text && (
                  <p className="text-sm mt-1">{card.sub_text}</p>
                )}
              </div>
            </div>


            {/* Rarity + Deck Limit — aligned with the name */}
            {(card.is_common || card.is_uncommon || card.is_rare || card.is_unique) && (
              <div className="ml-[72px] mt-2 text-sm">
                <span className="font-semibold">
                  {card.is_unique
                    ? 'Unique'
                    : card.is_rare
                      ? 'Rare'
                      : card.is_uncommon
                        ? 'Uncommon'
                        : 'Common'}
                </span>{' '}
                –{' '}
                {card.is_unique
                  ? 'You can have 1 copy per deck.'
                  : card.is_rare
                    ? 'You can have up to 2 copies per deck.'
                    : card.is_uncommon
                      ? 'You can have up to 3 copies per deck.'
                      : 'You can have up to 4 copies per deck.'}
              </div>
            )}


            {/* ATK / DEF + Advantage + Taxon aligned and centered */}
            <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-start mt-2">
              <div className="flex flex-col pl-[60px] items-center sm:items-start">
                {(card.attack !== null || card.defense !== null) && (
                  <div className="inline-flex overflow-hidden rounded-full shadow text-white text-lg font-semibold w-fit">
                    <div className="bg-red-200 text-red-900 px-4 py-2">
                      {card.attack ?? 0} ATK
                    </div>
                    <div className="bg-blue-200 text-blue-900 px-4 py-2 border-l border-white/40">
                      {card.defense ?? 0} DEF
                    </div>
                  </div>
                )}
                {card.advantage && (
                  <div className="text-sm font-medium italic mt-1 text-center w-full">
                    {card.advantage}
                  </div>
                )}
              </div>

              {taxons.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-[2px] sm:pt-[2px]">
                  {taxons.map((t) => (
                    <span
                      key={t}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${needsDarkText
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-white/20 text-white border border-white/20'
                        }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="px-18">
              {/* Card Text */}
              {card.text_box && (
                <div className="text-[15px] leading-relaxed">
                  <h2 className="text-base font-semibold mt-4">Card Text</h2>
                  <p className="mt-1 whitespace-pre-wrap">{card.text_box}</p>
                </div>
              )}

              {/* Illustrator / Set / Number — Full width */}
              {(card.illustrator || card.set_name || card.set_number) && (
                <div className="mt-4 flex justify-between text-base font-medium">
                  <span>
                    {card.illustrator ? `Illustrator: ${card.illustrator}` : ''}
                  </span>
                  <span>
                    {card.set_name ? `Set: ${card.set_name}` : ''}
                  </span>
                  <span>
                    {card.set_number ? `Card #: ${card.set_number}` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Flavor Text */}
            {card.flavor_text && (
              <div
                className={`italic mt-10 border-l-4 pl-4 ${needsDarkText
                    ? 'text-black/70 border-black/20'
                    : 'text-white/70 border-white/40'
                  }`}
              >
                “{card.flavor_text}”
              </div>
            )}


          </div>

          {/* Back Button */}
          <div className="pt-10 pb-4 flex justify-center">
            <Link
              href={`/?page=${page}`}
              className={`px-6 py-2 rounded-md font-semibold text-sm shadow transition ${needsDarkText
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              ← Back to Codex
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={card.image_url}
            alt={card.name}
            className="max-h-[90vh] max-w-full rounded shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
