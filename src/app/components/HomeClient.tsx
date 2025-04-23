'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, useTransition } from 'react'
import CardGrid from '../components/CardGrid'
import Pagination from '../components/Pagination'
import Sidebar from '../components/Sidebar'
import type { CryptidCampCard } from '../types/Card'
import Image from 'next/image'

export default function HomeClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)

  const [cards, setCards] = useState<CryptidCampCard[]>([])
  const [loading, setLoading] = useState(true)
  const [isRoutingToCard, setIsRoutingToCard] = useState(false) // ✅ NEW

  const [selectedType, setSelectedType] = useState('')
  const [selectedCabin, setSelectedCabin] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('')
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([])
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [costRange, setCostRange] = useState<[number, number]>([0, 5])

  const itemsPerPage = 12

  const prevFilters = useRef({
    type: '',
    cabin: '',
    rarity: '',
    taxa: [] as string[],
    search: '',
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [inputValue])

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)

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
      setLoading(false)
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

      startTransition(() => {
        router.push(`/?${params.toString()}`)
      })

      prevFilters.current = {
        type: selectedType,
        cabin: selectedCabin,
        rarity: selectedRarity,
        taxa: selectedTaxa,
        search: searchQuery,
      }
    }
  }, [selectedType, selectedCabin, selectedRarity, selectedTaxa, searchQuery, router, searchParams])

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
  
    const matchCost =
      typeof card.cost === 'number' &&
      card.cost >= costRange[0] &&
      card.cost <= costRange[1]
  
    return matchName && matchType && matchCabin && matchRarity && matchCost
  })
  

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const start = (pageFromUrl - 1) * itemsPerPage
  const pagedCards = filteredCards.slice(start, start + itemsPerPage)

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    if (searchQuery) params.set('search', searchQuery)

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
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
        costRange={costRange}
        setCostRange={setCostRange}
      />

      <main className="flex-1 relative overflow-y-auto">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

        <div className="relative z-40 p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600"></div>
            </div>
          ) : filteredCards.length === 0 ? (
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
              <div className="flex flex-col min-h-[calc(100vh-4rem)]"> {/* adjust 4rem if header exists */}
                <div className="flex-1">
                  <CardGrid
                    cards={pagedCards}
                    currentPage={pageFromUrl}
                    onCardClickStart={() => setIsRoutingToCard(true)}
                  />
                </div>
                <div className="mt-8">
                  <Pagination
                    currentPage={pageFromUrl}
                    totalPages={totalPages}
                    onPageChange={updatePage}
                  />
                </div>
              </div>

            </>
          )}
        </div>

        {(isPending || isRoutingToCard) && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </main>
    </div>
  )
}
