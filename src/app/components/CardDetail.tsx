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

    return (
        <div className="min-h-screen relative bg-gray-100 p-6 md:p-12 overflow-hidden">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

            {/* Foreground content */}
            <div
                className={`relative z-20 max-w-6xl mx-auto shadow-md rounded-lg overflow-hidden md:flex ${textClass}`}
                style={{ backgroundColor: bg }}
            >
                {/* Card Image */}
                <div className="md:w-1/3 p-6 flex items-center justify-center border-r border-gray-200">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="focus:outline-none"
                    >
                        <div className="relative group cursor-zoom-in transition-transform duration-200 transform hover:scale-105">
                            <CardImage src={card.image_url} alt={card.name} />

                            {/* Overlay Icon */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                        </div>

                    </button>
                </div>

                {/* Card Info */}
                <div className="md:w-2/3 p-6 space-y-4 relative">
                    {/* Cabin Badge + Label */}
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


                    {/* Name and Subtext */}
                    <h1 className="text-3xl font-bold leading-tight">{card.name}</h1>
                    {card.sub_text && (
                        <p className="text-sm -mt-1">{card.sub_text}</p>
                    )}

                    {/* ATK / DEF */}
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

                    {/* Card Attributes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div><span className="font-medium">Cabin:</span> {card.cabin ?? 'Unknown'}</div>
                        <div><span className="font-medium">Cost:</span> {card.cost ?? 'N/A'}</div>
                        <div>
                            <span className="font-medium">Rarity:</span>{' '}
                            {card.is_unique
                                ? 'Unique'
                                : card.is_rare
                                    ? 'Rare'
                                    : card.is_uncommon
                                        ? 'Uncommon'
                                        : card.is_common
                                            ? 'Common'
                                            : 'Unknown'}
                        </div>
                        <div>
                            <span className="font-medium">Type:</span>{' '}
                            {card.is_cryptid
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
                                                    : 'Other'}
                        </div>
                        {card.advantage && (
                            <div><span className="font-medium">Advantage:</span> {card.advantage}</div>
                        )}
                        {card.taxon && (
                            <div><span className="font-medium">Taxon:</span> {card.taxon}</div>
                        )}
                        <div>
                            <span className="font-medium">Set:</span> {card.set_name} ({card.set_number})
                        </div>
                        {card.illustrator && (
                            <div><span className="font-medium">Illustrator:</span> {card.illustrator}</div>
                        )}
                    </div>

                    {/* Card Text */}
                    {card.text_box && (
                        <div>
                            <h2 className="text-sm font-semibold mt-4">Card Text</h2>
                            <p className="mt-1 whitespace-pre-wrap">{card.text_box}</p>
                        </div>
                    )}

                    {/* Flavor Text */}
                    {card.flavor_text && (
                        <div className="italic text-gray-500 mt-4 border-l-4 border-gray-300 pl-4">
                            “{card.flavor_text}”
                        </div>
                    )}

                    {/* Back to Gallery */}
                    <div className="pt-6">
                        <Link
                            href={`/?page=${page}`}
                            className="text-blue-600 hover:underline font-medium text-sm"
                        >
                            ← Back to Codex (Page {page})
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
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
