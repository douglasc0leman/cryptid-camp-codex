'use client'

import Image from 'next/image'

type Props = {
  selectedType: string
  setSelectedType: (value: string) => void
  selectedCabin: string
  setSelectedCabin: (value: string) => void
  selectedRarity: string
  setSelectedRarity: (value: string) => void
  selectedTaxa: string[]
  setSelectedTaxa: React.Dispatch<React.SetStateAction<string[]>>
}

const typeOptions = ['Cryptid', 'Lantern', 'Trail', 'Supply', 'Memory Trap']
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
  setSelectedTaxa
}: Props) {
  return (
    <aside className="relative min-h-screen w-full max-w-[16rem]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/sidebar-bg.png')" }}
      />

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* Actual content */}
      <div className="relative z-20 px-4 pb-4 text-white overflow-y-auto">
        <div className="mb-6 mt-4 flex justify-center">
          <Image
            src="/images/cc-codex.png"
            alt="Cryptid Camp Logo"
            width={160}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Filter Cards</h2>
        <div className="space-y-4">
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

          {/* Taxa Filter */}
          <div className="mt-6">
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
                'Alien', 'Angel', 'Avian', 'Bovine', 'Canine', 'Caprid', 'Celestial', 'Cervine',
                'Demon', 'Deity', 'Draconid', 'Dulcis', 'Elemental', 'Equine', 'Fae', 'Feline',
                'Golem', 'Humanoid', 'Impersator', 'Insectoid', 'Interloper', 'Invader',
                'Lagomorph', 'Magus', 'Mecha', 'Observer', 'Phantom', 'Prophet', 'Revenant',
                'Rodent', 'Sanguivore', 'Saurian', 'Serpent', 'Spirit'
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
