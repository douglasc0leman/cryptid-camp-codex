'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import CardGrid from './components/CardGrid'
import Pagination from './components/Pagination'
import Sidebar from './components/Sidebar'
import type { CryptidCampCard } from './types/Card'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)

  const [cards, setCards] = useState<CryptidCampCard[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [selectedCabin, setSelectedCabin] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([])

  // 👇 New dual search state
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const itemsPerPage = 12

  const prevFilters = useRef({
    type: '',
    cabin: '',
    rarity: '',
    taxa: [] as string[],
    search: '',
  })

  // 👇 Debounce the visible input into the actual search filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [inputValue])

  useEffect(() => {
    const fetchCards = async () => {
      const queryParams = new URLSearchParams()
      if (selectedTaxa.length > 0) {
        queryParams.set('taxa', selectedTaxa.join(','))
      }

      const res = await fetch(`/api/cards?${queryParams.toString()}`)
      const data = await res.json()

      const sorted = data.sort((a: CryptidCampCard, b: CryptidCampCard) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      )

      setCards(sorted)
    }

    fetchCards()
  }, [selectedTaxa])

  useEffect(() => {
    const filtersChanged =
      prevFilters.current.type !== selectedType ||
      prevFilters.current.cabin !== selectedCabin ||
      prevFilters.current.rarity !== selectedRarity ||
      JSON.stringify(prevFilters.current.taxa) !== JSON.stringify(selectedTaxa) ||
      prevFilters.current.search !== searchQuery

    if (filtersChanged) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')
      if (searchQuery) params.set('search', searchQuery)
      else params.delete('search')

      router.push(`/?${params.toString()}`)

      prevFilters.current = {
        type: selectedType,
        cabin: selectedCabin,
        rarity: selectedRarity,
        taxa: selectedTaxa,
        search: searchQuery,
      }
    }
  }, [selectedType, selectedCabin, selectedRarity, selectedTaxa, searchQuery])

  const filteredCards = cards.filter(card => {
    const matchName = card.name.toLowerCase().includes(searchQuery.toLowerCase())
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

    return matchName && matchType && matchCabin && matchRarity
  })

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const start = (pageFromUrl - 1) * itemsPerPage
  const pagedCards = filteredCards.slice(start, start + itemsPerPage)

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    if (searchQuery) params.set('search', searchQuery)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex text-gray-800 relative">
      <Sidebar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCabin={selectedCabin}
        setSelectedCabin={setSelectedCabin}
        selectedRarity={selectedRarity}
        setSelectedRarity={setSelectedRarity}
        selectedTaxa={selectedTaxa}
        setSelectedTaxa={setSelectedTaxa}
        searchQuery={inputValue}
        setSearchQuery={setInputValue}
      />

      <main className="flex-1 relative overflow-y-auto">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

        <div className="relative z-40 p-8">
        {filteredCards.length === 0 ? (
  <div className="text-center text-gray-600 mt-16 text-lg flex flex-col items-center space-y-4">
    <Image
      src="/images/squonk.png"
      alt="Crying Squonk"
      width={200}
      height={200}
      className="opacity-80"
    />
    <p>No cards match your search or filter criteria.</p>
  </div>
) : (
  <>
    <CardGrid cards={pagedCards} currentPage={pageFromUrl} />
    <Pagination
      currentPage={pageFromUrl}
      totalPages={totalPages}
      onPageChange={updatePage}
    />
  </>
)}

        </div>
      </main>
    </div>
  )
}
