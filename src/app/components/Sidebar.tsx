'use client'

import Image from 'next/image'
import { Range } from 'react-range'

type Props = {
  selectedType: string
  setSelectedType: (value: string) => void
  selectedCabin: string
  setSelectedCabin: (value: string) => void
  selectedRarity: string
  setSelectedRarity: (value: string) => void
  selectedTaxa: string[]
  setSelectedTaxa: React.Dispatch<React.SetStateAction<string[]>>
  searchQuery: string
  setSearchQuery: (value: string) => void
  costRange: [number, number]
  setCostRange: React.Dispatch<React.SetStateAction<[number, number]>>
}

const typeOptions = ['Cryptid', 'Lantern', 'Trail', 'Supply', 'Memory', 'Trap']
const cabinOptions = ['Obsidian', 'Quartz', 'Fluorite', 'Meteorite', 'Malachite', 'Fulgurite', 'Lapis', 'Corallium']
const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Unique']

export default function Sidebar({
  selectedType,
  setSelectedType,
  selectedCabin,
  setSelectedCabin,
  selectedRarity,
  setSelectedRarity,
  selectedTaxa,
  setSelectedTaxa,
  searchQuery,
  setSearchQuery,
  costRange,
  setCostRange,
}: Props) {
  return (
    <aside className="relative min-h-screen w-full max-w-[16rem]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/sidebar-bg.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-4 mt-4 px-4 flex justify-center shrink-0">
          <Image
            src="/images/cc-codex.png"
            alt="Cryptid Camp Logo"
            width={160}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {/* Scrollable filter section */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 text-white">
          {/* 🔍 Search by Name */}
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-medium mb-1">Search by Name</label>
            <input
              id="search"
              type="text"
              placeholder="e.g. Mothman"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-sm text-gray-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-[34px] pb-[5px] text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="relative">
              <select
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none cursor-pointer"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All</option>
                {typeOptions.map((type) => (
                  <option key={type.toLowerCase()} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
              {selectedType ? (
                <button
                  type="button"
                  onClick={() => setSelectedType('')}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-700 text-base hover:text-red-500"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700 text-sm">
                  ↓
                </div>
              )}
            </div>
          </div>

          {/* Cabin Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Cabin</label>
            <div className="relative">
              <select
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none cursor-pointer"
                value={selectedCabin}
                onChange={(e) => setSelectedCabin(e.target.value)}
              >
                <option value="">All</option>
                {cabinOptions.map((cabin) => (
                  <option key={cabin.toLowerCase()} value={cabin.toLowerCase()}>{cabin}</option>
                ))}
              </select>
              {selectedCabin ? (
                <button
                  type="button"
                  onClick={() => setSelectedCabin('')}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-700 text-base hover:text-red-500"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700 text-sm">
                  ↓
                </div>
              )}
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Rarity</label>
            <div className="relative">
              <select
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none cursor-pointer"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                <option value="">All</option>
                {rarityOptions.map((rarity) => (
                  <option key={rarity.toLowerCase()} value={rarity.toLowerCase()}>{rarity}</option>
                ))}
              </select>
              {selectedRarity ? (
                <button
                  type="button"
                  onClick={() => setSelectedRarity('')}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-700 text-base hover:text-red-500"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700 text-sm">
                  ↓
                </div>
              )}
            </div>
          </div>

          {/* Level Slider */}
          <div className="text-white pb-4 mb-4 border-b border-white/20">

            <div className="mb-6 px-2">
              <label className="text-sm font-medium block mb-4">Level Range</label>
              <Range
                step={1}
                min={0}
                max={5}
                values={costRange}
                onChange={(values) => setCostRange(values as [number, number])}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 bg-gray-400 rounded-md relative"
                    style={props.style}
                  >
                    {children}
                    <div className="absolute top-4 left-0 right-0 flex justify-between text-xs text-white font-mono px-1">
                      {[0, 1, 2, 3, 4, 5].map((val) => (
                        <span key={val}>{val}</span>
                      ))}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => {
                  const { key, ...rest } = props
                  return (
                    <div
                      key={key}
                      {...rest}
                      className="w-4 h-4 bg-indigo-500 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                      style={props.style}
                    />
                  )
                }}
              />
            </div>
          </div>



          {/* ✅ Taxa Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Filter by Taxa</label>
              {selectedTaxa.length > 0 && (
                <button
                  onClick={() => setSelectedTaxa([])}
                  className="text-gray-300 hover:text-white focus:outline-none"
                  aria-label="Clear Taxa Filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 8.586L4.707 3.293a1 1 0 10-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 101.414 1.414L10 11.414l5.293 5.293a1 1 0 001.414-1.414L11.414 10l5.293-5.293a1 1 0 00-1.414-1.414L10 8.586z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <div className="border rounded p-2 max-h-64 overflow-y-auto space-y-2 bg-white/10">
              {[
                'All Taxa',
                'Alien', 'Angel', 'Anuran', 'Arachnid', 'Avian', 'Bovine', 'Canine', 'Caprid',
                'Celestial', 'Cervine', 'Cephalopod', 'Demon', 'Deity', 'Draconid', 'Dulcis',
                'Elemental', 'Equine', 'Fae', 'Ferus', 'Feline', 'Golem', 'Humanoid',
                'Impersator', 'Insectoid', 'Interloper', 'Invader', 'Lagomorph', 'Magus',
                'Mecha', 'Mer', 'Observer', 'Phantom', 'Piscis', 'Prophet', 'Revenant',
                'Rodent', 'Sanguivore', 'Sasquatch', 'Saurian', 'Serpent', 'Simian', 'Spirit',
                'Suid', 'Ursa', 'Vermis', 'Yokai'
              ].map((taxon) => (
                <label key={taxon} className="flex items-center text-sm text-white">
                  <input
                    type="checkbox"
                    value={taxon}
                    checked={selectedTaxa.includes(taxon)}
                    onChange={(e) => {
                      const value = e.target.value
                      setSelectedTaxa((prev: string[]) =>
                        prev.includes(value)
                          ? prev.filter((t: string) => t !== value)
                          : [...prev, value]
                      )
                    }}
                    className="mr-2"
                  />
                  {taxon}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}
