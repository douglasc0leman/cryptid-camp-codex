'use client';

import Image from 'next/image';
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
};

const weatherConditions = ['Clear Sky', 'Fog', 'Day', 'Night', 'Heat', 'Rain', 'Storm', 'Calm'];
const typeOptions = ['Cryptid', 'Lantern', 'Trail', 'Supply', 'Memory', 'Trap', 'Environment'];
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
}: Props) {
  const hasActiveFilters = selectedType || selectedCabin || selectedRarity || selectedTaxa.length > 0 || selectedWeather.length > 0 || searchQuery || costRange[0] !== 0 || costRange[1] !== 6;

  return (
    <aside className="relative min-h-screen w-full max-w-[16rem]">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/sidebar-bg.png')" }} />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full max-h-screen overflow-y-auto">
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

        {hasActiveFilters && (
          <div className="px-2 mb-4 transition-all duration-300 transform 
                          opacity-100 translate-y-0">
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-200 text-gray-800 p-2 rounded shadow hover:bg-gray-300 text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}



        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 text-white custom-scrollbar">
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
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900"
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
            </div>
          </div>

          {/* Cabin Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Cabin</label>
            <div className="relative">
              <select
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900"
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
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Rarity</label>
            <div className="relative">
              <select
                className="w-full border p-2 pr-10 rounded bg-white text-gray-900"
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
            </div>
          </div>

          {/* Level Slider */}
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
                    {/* Number labels */}
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
                      {...restProps}
                      key={key}
                      className="w-4 h-4 bg-indigo-500 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  );
                }}
              />
            </div>
          </div>


          {/* Taxa Filter */}
          <div>
            <label className="text-sm font-medium block mb-2">Filter by Taxa</label>
            <div className="space-y-2 max-h-64 overflow-y-auto bg-white/10 p-2 rounded custom-scrollbar">
              {allTaxa.map((taxon) => (
                <label key={taxon} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    value={taxon}
                    checked={selectedTaxa.includes(taxon)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedTaxa(prev =>
                        prev.includes(value)
                          ? prev.filter(t => t !== value)
                          : [...prev, value]
                      );
                    }}
                    className="mr-2"
                  />
                  {taxon}
                </label>
              ))}
            </div>
          </div>

  
{/* Weather Conditions */}
<div>
  <label className="text-sm font-medium block mb-2">Filter by Weather</label>
  <div className="space-y-2 max-h-64 overflow-y-auto bg-white/10 p-2 rounded custom-scrollbar">
    {weatherConditions.map((weather) => (
      <label key={weather} className="flex items-center text-sm">
        <input
          type="checkbox"
          value={weather}
          checked={selectedWeather.includes(weather)}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedWeather(prev =>
              prev.includes(value)
                ? prev.filter(w => w !== value)
                : [...prev, value]
            );
          }}
          className="mr-2"
        />
        {weather}
      </label>
    ))}
  </div>
</div>



        </div>
      </div>
    </aside>
  );
}
