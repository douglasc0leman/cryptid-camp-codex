'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CardGrid from './components/CardGrid'
import Pagination from './components/Pagination'
import Sidebar from './components/Sidebar'
import type { CryptidCampCard } from './types/Card'

export default function Home() {
  const [cards, setCards] = useState<CryptidCampCard[]>([])

  const searchParams = useSearchParams()
  const initialPage = parseInt(searchParams.get('page') || '1', 10)

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedType, setSelectedType] = useState('')
  const [selectedCabin, setSelectedCabin] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([])

  const itemsPerPage = 12

  useEffect(() => {
    const fetchCards = async () => {
      const queryParams = new URLSearchParams()
      if (selectedTaxa.length > 0) {
        queryParams.set('taxa', selectedTaxa.join(','))
      }
      const res = await fetch(`/api/cards?${queryParams.toString()}`)
      const data = await res.json()
      setCards(data)
    }
    fetchCards()
  }, [selectedTaxa])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedCabin, selectedRarity])

  const filteredCards = cards.filter(card => {
    const matchType = selectedType
      ? (card.is_cryptid && selectedType === 'cryptid') ||
        (card.is_lantern && selectedType === 'lantern') ||
        (card.is_trail && selectedType === 'trail') ||
        (card.is_supply && selectedType === 'supply') ||
        (card.is_memory && selectedType === 'memory') ||
        (card.is_trap && selectedType === 'trap')
      : true

    const matchCabin = selectedCabin
      ? card.cabin?.toLowerCase() === selectedCabin
      : true

    const matchRarity = selectedRarity
      ? (selectedRarity === 'common' && card.is_common) ||
        (selectedRarity === 'uncommon' && card.is_uncommon) ||
        (selectedRarity === 'rare' && card.is_rare) ||
        (selectedRarity === 'unique' && card.is_unique)
      : true

    return matchType && matchCabin && matchRarity
  })

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pagedCards = filteredCards.slice(start, end)

  return (
    <div className="min-h-screen flex text-gray-800 relative">
      {/* Sidebar */}
      <Sidebar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCabin={selectedCabin}
        setSelectedCabin={setSelectedCabin}
        selectedRarity={selectedRarity}
        setSelectedRarity={setSelectedRarity}
        selectedTaxa={selectedTaxa}
        setSelectedTaxa={setSelectedTaxa}
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />


        {/* Foreground Content */}
        <div className="relative z-40 p-8">
          <CardGrid cards={pagedCards} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        
        {/* Magical Particles */}
        {/* <div className="absolute inset-0 min-h-full z-30 pointer-events-none overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => {
            const size = Math.random() * 3 + 1
            const style = {
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }
            return <div key={i} className="particle twinkle" style={style} />
          })}
        </div> */}
      </main>
    </div>
  )
}
