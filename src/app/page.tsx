'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CardGrid from './components/CardGrid'
import Pagination from './components/Pagination'
import Sidebar from './components/Sidebar'
import type { CryptidCampCard } from './types/Card'

const typeOptions = ['Cryptid', 'Lantern', 'Trail', 'Supply', 'Memory Trap']
const cabinOptions = ['Obsidian', 'Quartz', 'Fluorite', 'Meteorite', 'Malachite', 'Fulgurite', 'Lapis', 'Corallium']
const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Unique']

const types = typeOptions
const cabins = cabinOptions
const rarities = rarityOptions

// const cards = Array.from({ length: 100 }).map((_, i) => ({
//   id: i,
//   name: `Card ${i + 1}`,
//   type: types[i % types.length],
//   cabin: cabins[i % cabins.length],
//   rarity: rarities[i % rarities.length],
// }))

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
        (card.is_memory && selectedType === 'memory trap')
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
  console.log(pagedCards)

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
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
      <main className="flex-1 p-8 overflow-y-auto">
        <CardGrid cards={pagedCards} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
    </div>
  )
}
