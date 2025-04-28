'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Range } from 'react-range';

type Props = {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCabin: string;
  setSelectedCabin: (value: string) => void;
  selectedRarity: string;
  setSelectedRarity: (value: string) => void;
  selectedTaxa: string[];
  setSelectedTaxa: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  costRange: [number, number];
  setCostRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  onClearFilters: () => void;
  selectedWeather: string[];
  setSelectedWeather: React.Dispatch<React.SetStateAction<string[]>>;
  searchEffectQuery: string;
  setSearchEffectQuery: (value: string) => void;
  selectedTraits: string[];
  setSelectedTraits: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSet: string;
  setSelectedSet: (value: string) => void;
};
const setOptions = ['Base Set', '2024 Christmas', "2025 Valentine's Day", '2152 Monthly Promos'];
const weatherConditions = ['Clear Sky', 'Fog', 'Day', 'Night', 'Heat', 'Rain', 'Storm', 'Calm'];
const traitOptions = ['Digger', 'Flyer', 'Swimmer', 'Rush', 'First-Strike', 'Bloodsucker 1', 'Bloodsucker 2', 'Lethal', 'Flash', 'Raid 1', 'Swift'];
const typeOptions = ['Cryptid', 'Trail', 'Supply', 'Memory', 'CZO', 'Trap', 'Environment', 'Lantern', 'Special Lantern'];
const cabinOptions = ['Gem', 'Obsidian', 'Quartz', 'Fluorite', 'Meteorite', 'Malachite', 'Fulgurite', 'Lapis', 'Corallium'];
const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Unique'];
const allTaxa = [
  'All Taxa', 'Alien', 'Angel', 'Anuran', 'Arachnid', 'Avian', 'Bovine', 'Canine', 'Caprid',
  'Celestial', 'Cervine', 'Cephalopod', 'Demon', 'Deity', 'Draconid', 'Dulcis',
  'Elemental', 'Equine', 'Fae', 'Ferus', 'Feline', 'Golem', 'Humanoid',
  'Impersator', 'Insectoid', 'Interloper', 'Invader', 'Lagomorph', 'Magus',
  'Mecha', 'Mer', 'Observer', 'Phantom', 'Piscis', 'Prophet', 'Revenant',
  'Rodent', 'Sanguivore', 'Sasquatch', 'Saurian', 'Serpent', 'Simian', 'Spirit',
  'Suid', 'Ursa', 'Vermis', 'Yokai'
];

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
  onClearFilters,
  selectedWeather,
  setSelectedWeather,
  searchEffectQuery,
  setSearchEffectQuery,
  selectedTraits,
  setSelectedTraits,
  selectedSet,
  setSelectedSet
}: Props) {
  const hasActiveFilters = selectedType || selectedSet || selectedCabin || selectedRarity || selectedTraits.length > 0 || selectedTaxa.length > 0 || selectedWeather.length > 0 || searchQuery || searchEffectQuery || costRange[0] !== 0 || costRange[1] !== 6;

  return (
    <aside className="relative min-h-screen w-full max-w-[16rem]">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/sidebar-bg.png')" }} />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full max-h-screen overflow-y-auto">
        {/* Logo */}
        <div className="mb-4 mt-4 px-4 flex justify-center shrink-0">
          <Link href="/" className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <Image
              src="/images/cc-codex.png"
              alt="Cryptid Camp Logo"
              width={160}
              height={100}
              className="object-contain cursor-pointer"
              priority
            />
          </Link>
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <div className="px-2 mb-4">
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-200 text-gray-800 p-2 rounded shadow hover:bg-gray-300 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 text-white custom-scrollbar">
          {/* Search by Name */}
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
                className="absolute right-2 top-[34px] text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>

          {/* Search by Effect */}
          <div className="relative">
            <label htmlFor="effectSearch" className="block text-sm font-medium mb-1">Search by Effect</label>
            <input
              id="effectSearch"
              type="text"
              placeholder="e.g. Draw 2"
              value={searchEffectQuery}
              onChange={(e) => setSearchEffectQuery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-sm text-gray-800"
            />
            {searchEffectQuery && (
              <button
                onClick={() => setSearchEffectQuery('')}
                className="absolute right-2 top-[34px] text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <label htmlFor="type" className="block text-sm font-medium mb-1">Filter by Type</label>
            <div className="relative flex items-center">
              <select
                id="type"
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>

              {selectedType ? (
                <button
                  onClick={() => setSelectedType('')}
                  className="absolute right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute right-3 text-gray-500 text-xl">
                  ↓
                </div>
              )}
            </div>
          </div>


          {/* Cabin Filter */}
          <div className="relative">
            <label htmlFor="cabin" className="block text-sm font-medium mb-1">Filter by Cabin</label>
            <div className="relative flex items-center">
              <select
                id="cabin"
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none"
                value={selectedCabin}
                onChange={(e) => setSelectedCabin(e.target.value)}
              >
                <option value="">All</option>
                {cabinOptions.map((cabin) => (
                  <option key={cabin} value={cabin.toLowerCase()}>
                    {cabin}
                  </option>
                ))}
              </select>

              {selectedCabin ? (
                <button
                  onClick={() => setSelectedCabin('')}
                  className="absolute right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute right-3 text-gray-500 text-xl">
                  ↓
                </div>
              )}
            </div>
          </div>

          {/* Rarity Filter */}
          <div className="relative">
            <label htmlFor="rarity" className="block text-sm font-medium mb-1">Filter by Rarity</label>
            <div className="relative flex items-center">
              <select
                id="rarity"
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                <option value="">All</option>
                {rarityOptions.map((rarity) => (
                  <option key={rarity} value={rarity.toLowerCase()}>
                    {rarity}
                  </option>
                ))}
              </select>

              {selectedRarity ? (
                <button
                  onClick={() => setSelectedRarity('')}
                  className="absolute right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute right-3 text-gray-500 text-xl">
                  ↓
                </div>
              )}
            </div>
          </div>

          {/* Set Filter */}
          <div className="relative">
            <label htmlFor="set" className="block text-sm font-medium mb-1">Filter by Set</label>
            <div className="relative flex items-center">
              <select
                id="set"
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900 appearance-none"
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
              >
                <option value="">All</option>
                {setOptions.map((setName) => (
                  <option key={setName} value={setName}>
                    {setName}
                  </option>
                ))}
              </select>

              {selectedSet ? (
                <button
                  onClick={() => setSelectedSet('')}
                  className="absolute right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              ) : (
                <div className="pointer-events-none absolute right-3 text-gray-500 text-xl">
                  ↓
                </div>
              )}
            </div>
          </div>


          {/* Level Range */}
          <div className="pb-4 mb-4 border-b border-white/20">
            <div className="mb-6 px-2">
              <label className="text-sm font-medium block mb-4">Level Range</label>
              <Range
                step={1}
                min={0}
                max={6}
                values={costRange}
                onChange={(values) => setCostRange(values as [number, number])}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 bg-gray-400 rounded-md relative" style={props.style}>
                    {children}
                    {[0, 1, 2, 3, 4, 5, 6].map((val) => (
                      <div
                        key={val}
                        className="absolute text-xs text-white font-mono"
                        style={{
                          top: '12px',
                          left: `${(val / 6) * 100}%`,
                          transform: 'translateX(-50%)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {val === 6 ? '6+' : val}
                      </div>
                    ))}
                  </div>
                )}
                renderThumb={({ props }) => {
                  const { key, ...restProps } = props;
                  return (
                    <div
                      key={key}
                      {...restProps}
                      className="w-4 h-4 bg-indigo-500 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  );
                }}
              />
            </div>
          </div>

          {/* Traits Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Filter by Traits</label>
              {selectedTraits.length > 0 && (
                <button onClick={() => setSelectedTraits([])} className="text-xs text-red-400 hover:text-red-600">
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded custom-scrollbar max-h-64 overflow-y-auto">
              {[...traitOptions].sort().map((trait) => (
                <button
                  key={trait}
                  onClick={() => {
                    setSelectedTraits((prev) =>
                      prev.includes(trait)
                        ? prev.filter((t) => t !== trait)
                        : [...prev, trait]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedTraits.includes(trait)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/20 text-white border border-white/20'
                    }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>


          {/* Weather Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Filter by Weather</label>
              {selectedWeather.length > 0 && (
                <button onClick={() => setSelectedWeather([])} className="text-xs text-red-400 hover:text-red-600">
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded custom-scrollbar max-h-64 overflow-y-auto">
              {[...weatherConditions].sort().map((weather) => (
                <button
                  key={weather}
                  onClick={() => {
                    setSelectedWeather((prev) =>
                      prev.includes(weather)
                        ? prev.filter((w) => w !== weather)
                        : [...prev, weather]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedWeather.includes(weather)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/20 text-white border border-white/20'
                    }`}
                >
                  {weather}
                </button>
              ))}
            </div>
          </div>

          {/* Taxa Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Filter by Taxa</label>
              {selectedTaxa.length > 0 && (
                <button onClick={() => setSelectedTaxa([])} className="text-xs text-red-400 hover:text-red-600">
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded custom-scrollbar max-h-64 overflow-y-auto">
              {/* Sort but always keep "All Taxa" first */}
              {['All Taxa', ...allTaxa.filter(t => t !== 'All Taxa').sort()].map((taxon) => (
                <button
                  key={taxon}
                  onClick={() => {
                    setSelectedTaxa((prev) =>
                      prev.includes(taxon)
                        ? prev.filter((t) => t !== taxon)
                        : [...prev, taxon]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedTaxa.includes(taxon)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/20 text-white border border-white/20'
                    }`}
                >
                  {taxon}
                </button>
              ))}
            </div>
          </div>


        </div>
      </div>
    </aside>
  );
}
