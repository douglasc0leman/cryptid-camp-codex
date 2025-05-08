'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { SortOption } from '../types/SortOption';

type Props = {
  selectedType: string[];
  setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCabin: string[];
  setSelectedCabin: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRarity: string[];
  setSelectedRarity: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSet: string[];
  setSelectedSet: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTaxa: string[];
  setSelectedTaxa: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchMode: 'name' | 'effect' | 'both';
  setSearchMode: (value: 'name' | 'effect' | 'both') => void;
  costRange: [number, number];
  setCostRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  attackMode: 'exact' | 'range';
  setAttackMode: React.Dispatch<React.SetStateAction<'exact' | 'range'>>;
  defenseMode: 'exact' | 'range';
  setDefenseMode: React.Dispatch<React.SetStateAction<'exact' | 'range'>>;
  attackRange: [number, number];
  setAttackRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  defenseRange: [number, number];
  setDefenseRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  onClearFilters: () => void;
  selectedWeather: string[];
  setSelectedWeather: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTraits: string[];
  setSelectedTraits: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIllustrators: string[];
  setSelectedIllustrators: React.Dispatch<React.SetStateAction<string[]>>;
  sortOption: string;
  setSortOption: (value: SortOption) => void;
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
  'Earth', 'Elemental', 'Equine', 'Fae', 'Ferus', 'Feline', 'Golem', 'Humanoid',
  'Impersonator', 'Insectoid', 'Interloper', 'Invader', 'Lagomorph', 'Lightning',
  'Magus', 'Mecha', 'Mer', 'Metal', 'Observer', 'Phantom', 'Piscis', 'Prophet',
  'Revenant', 'Rodent', 'Sanguivore', 'Sasquatch', 'Saurian', 'Serpent', 'Simian',
  'Spirit', 'Suid', 'Sylvan', 'Ursa', 'Vermis', 'Water', 'Wind', 'Yokai'
];

const illustratorOptions = 
[
  'Anela Botello',
  'Cosmo',
  'EldritchRach',
  'Emily Nancy',
  'Gabriela M.',
  'Geccco',
  'Kate Becker',
  'Kelsey Jachino',
  'Layla Arnt',
  'Lillie McKay',
  'Nevan G',
  'Pepper DeLuca',
  'Tanner Wright'
];

export default function Sidebar({
  selectedType,
  setSelectedType,
  selectedCabin,
  setSelectedCabin,
  selectedRarity,
  setSelectedRarity,
  selectedSet,
  setSelectedSet,
  selectedTaxa,
  setSelectedTaxa,
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  costRange,
  setCostRange,
  attackMode,
  setAttackMode,
  defenseMode,
  setDefenseMode,
  attackRange,
  setAttackRange,
  defenseRange,
  setDefenseRange,
  onClearFilters,
  selectedWeather,
  setSelectedWeather,
  selectedTraits,
  setSelectedTraits,
  selectedIllustrators,
  setSelectedIllustrators,
  sortOption,
  setSortOption
}: Props) {

  const hasActiveFilters =
    selectedType.length > 0 ||
    selectedSet.length > 0 ||
    selectedCabin.length > 0 ||
    selectedRarity.length > 0 ||
    selectedTraits.length > 0 ||
    selectedTaxa.length > 0 ||
    selectedWeather.length > 0 ||
    searchQuery ||
    selectedIllustrators.length > 0 ||
    costRange[0] !== 0 || costRange[1] !== 6 ||
    (attackMode === 'exact' ? attackRange[0] !== 0 : attackRange[0] !== 0 || attackRange[1] !== 15) ||
    (defenseMode === 'exact' ? defenseRange[0] !== 0 : defenseRange[0] !== 0 || defenseRange[1] !== 15);


  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCabinOpen, setIsCabinOpen] = useState(false);
  const [isRarityOpen, setIsRarityOpen] = useState(false);
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [isTraitsOpen, setIsTraitsOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isTaxaOpen, setIsTaxaOpen] = useState(false);
  const [isIllustratorOpen, setIsIllustratorOpen] = useState(false);

  // Auto-expand based on active filters
  useEffect(() => {
    if (selectedType.length > 0) setIsTypeOpen(true);
    if (selectedCabin.length > 0) setIsCabinOpen(true);
    if (selectedRarity.length > 0) setIsRarityOpen(true);
    if (selectedSet.length > 0) setIsSetOpen(true);
    if (selectedTraits.length > 0) setIsTraitsOpen(true);
    if (selectedWeather.length > 0) setIsWeatherOpen(true);
    if (selectedTaxa.length > 0) setIsTaxaOpen(true);
    if (selectedIllustrators.length > 0) setIsIllustratorOpen(true);
  }, [selectedType, selectedCabin, selectedRarity, selectedSet, selectedTraits, selectedWeather, selectedTaxa, selectedIllustrators]);

  return (
<aside className="h-screen flex flex-col w-full max-w-[16rem]">


      {/* blur effect over sidebar */}
      {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" /> */}

      {/* Content Container */}
      <div className="relative z-20 flex flex-col h-full">
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
          <div className="px-2 mb-4 flex justify-center">
            <button
              onClick={onClearFilters}
              className="w-[90%] max-w-sm rounded-md px-5 py-3 text-sm font-semibold backdrop-blur-sm bg-white/10 text-white border border-white/20 shadow hover:bg-white/20 transition-all duration-200 tracking-wide animate-float-pulse"
            >
              ✨ Clear All Filters ✨
            </button>
          </div>
        )}

        {/* Sort Control */}
        <div className='text-white mb-6 px-4'>
          <label htmlFor="sort" className="text-sm font-medium block mb-1">Sort By</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full border p-2 rounded bg-white text-gray-900 text-sm"
          >
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="cost_asc">Cost Low → High</option>
            <option value="cost_desc">Cost High → Low</option>
            <option value="set_number_asc">Set Number Low → High</option>
            <option value="set_number_desc">Set Number High → Low</option>
          </select>
        </div>

        <div className="px-4 pb-4 space-y-6 text-white overflow-y-auto max-h-[calc(100vh-16rem)] custom-scrollbar">

          {/* Search Bar */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1 gap-2">
              <label htmlFor="combinedSearch" className="text-sm font-medium whitespace-nowrap">Search by</label>
              <div className="flex gap-1 flex-wrap">
                {['name', 'effect', 'both'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSearchMode(mode as 'name' | 'effect' | 'both')}
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-medium leading-tight transition duration-200 ${searchMode === mode
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-center mt-3">
              <input
                id="combinedSearch"
                type="text"
                placeholder={
                  searchMode === 'name'
                    ? 'e.g. Mothman'
                    : searchMode === 'effect'
                      ? 'e.g. Draw 2'
                      : 'e.g. Mothman or Draw 2'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-sm text-gray-800"
              />
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

          {/* ATK Filter */}
          <div className="pb-4 border-b border-white/20">
            <div className="px-2">
              {/* Label + Mode Pills Inline */}
              <div className="flex justify-between items-center mb-3 gap-2">
                <label className="text-sm font-medium whitespace-nowrap">ATK Filter</label>
                <div className="flex gap-1 flex-wrap">
                  {['exact', 'range'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setAttackMode(mode as 'exact' | 'range')}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition duration-200 ${attackMode === mode
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/20 text-white border border-white/20'
                        }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Mode */}
              {attackMode === 'exact' && (
                <div className="flex justify-center items-center mt-2 space-x-2 text-white text-sm">
                  <input
                    type="number"
                    value={attackRange[0].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setAttackRange([val, val]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                </div>
              )}

              {/* Range Mode */}
              {attackMode === 'range' && (
                <div className="flex justify-between items-center mt-2 space-x-2 text-white text-sm">
                  <input
                    type="number"
                    value={attackRange[0].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setAttackRange([val, attackRange[1]]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                  <span className="px-1">to</span>
                  <input
                    type="number"
                    value={attackRange[1].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setAttackRange([attackRange[0], val]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                </div>
              )}
            </div>
          </div>

          {/* DEF Filter */}
          <div className="pb-4 border-b border-white/20">
            <div className="px-2">
              {/* Label + Mode Pills Inline */}
              <div className="flex justify-between items-center mb-3 gap-2">
                <label className="text-sm font-medium whitespace-nowrap">DEF Filter</label>
                <div className="flex gap-1 flex-wrap">
                  {['exact', 'range'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setDefenseMode(mode as 'exact' | 'range')}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition duration-200 ${defenseMode === mode
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/20 text-white border border-white/20'
                        }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Mode */}
              {defenseMode === 'exact' && (
                <div className="flex justify-center items-center mt-2 space-x-2 text-white text-sm">
                  <input
                    type="number"
                    value={defenseRange[0].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setDefenseRange([val, val]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                </div>
              )}

              {/* Range Mode */}
              {defenseMode === 'range' && (
                <div className="flex justify-between items-center mt-2 space-x-2 text-white text-sm">
                  <input
                    type="number"
                    value={defenseRange[0].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setDefenseRange([val, defenseRange[1]]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                  <span className="px-1">to</span>
                  <input
                    type="number"
                    value={defenseRange[1].toString()}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const val = raw === '' ? 0 : Math.max(0, Math.min(15, +raw));
                      setDefenseRange([defenseRange[0], val]);
                    }}
                    className="w-full max-w-[100px] p-1 bg-white text-gray-800 rounded text-center"
                    min={0}
                    max={15}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsTypeOpen(!isTypeOpen)}>
              <label className="text-sm font-medium">Filter by Type</label>
              <div className="flex items-center gap-2">
                {selectedType.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedType([]); }} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                )}
                <span className="text-sm">{isTypeOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isTypeOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {typeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType((prev) =>
                        prev.includes(type.toLowerCase())
                          ? prev.filter((t) => t !== type.toLowerCase())
                          : [...prev, type.toLowerCase()]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedType.includes(type.toLowerCase())
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Cabin Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsCabinOpen(!isCabinOpen)}>
              <label className="text-sm font-medium">Filter by Cabin</label>
              <div className="flex items-center gap-2">
                {selectedCabin.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCabin([]); }} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                )}
                <span className="text-sm">{isCabinOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isCabinOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {cabinOptions.map((cabin) => (
                  <button
                    key={cabin}
                    onClick={() => {
                      setSelectedCabin((prev) =>
                        prev.includes(cabin.toLowerCase())
                          ? prev.filter((t) => t !== cabin.toLowerCase())
                          : [...prev, cabin.toLowerCase()]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedCabin.includes(cabin.toLowerCase())
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Rarity Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsRarityOpen(!isRarityOpen)}>
              <label className="text-sm font-medium">Filter by Rarity</label>
              <div className="flex items-center gap-2">
                {selectedRarity.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedRarity([]); }} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                )}
                <span className="text-sm">{isRarityOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isRarityOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {rarityOptions.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => {
                      setSelectedRarity((prev) =>
                        prev.includes(rarity.toLowerCase())
                          ? prev.filter((t) => t !== rarity.toLowerCase())
                          : [...prev, rarity.toLowerCase()]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedRarity.includes(rarity.toLowerCase())
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Set Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsSetOpen(!isSetOpen)}>
              <label className="text-sm font-medium">Filter by Set</label>
              <div className="flex items-center gap-2">
                {selectedSet.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedSet([]); }} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                )}
                <span className="text-sm">{isSetOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isSetOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {setOptions.map((setName) => (
                  <button
                    key={setName}
                    onClick={() => {
                      setSelectedSet((prev) =>
                        prev.includes(setName)
                          ? prev.filter((s) => s !== setName)
                          : [...prev, setName]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedSet.includes(setName)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {setName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Traits Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsTraitsOpen(!isTraitsOpen)}>
              <label className="text-sm font-medium">Filter by Traits</label>
              <div className="flex items-center gap-2">
                {selectedTraits.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedTraits([]); }} className="text-xs text-red-400 hover:text-red-600">
                    Clear
                  </button>
                )}
                <span className="text-sm">{isTraitsOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isTraitsOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
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
            )}
          </div>


          {/* Weather Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsWeatherOpen(!isWeatherOpen)}>
              <label className="text-sm font-medium">Filter by Weather</label>
              <div className="flex items-center gap-2">
                {selectedWeather.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedWeather([]); }} className="text-xs text-red-400 hover:text-red-600">
                    Clear
                  </button>
                )}
                <span className="text-sm">{isWeatherOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isWeatherOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {[...weatherConditions].sort().map((weather) => (
                  <button
                    key={weather}
                    onClick={() => {
                      setSelectedWeather((prev) =>
                        prev.includes(weather)
                          ? prev.filter((t) => t !== weather)
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
            )}
          </div>

          {/* Taxa Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsTaxaOpen(!isTaxaOpen)}>
              <label className="text-sm font-medium">Filter by Taxa</label>
              <div className="flex items-center gap-2">
                {selectedTaxa.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedTaxa([]); }} className="text-xs text-red-400 hover:text-red-600">
                    Clear
                  </button>
                )}
                <span className="text-sm">{isTaxaOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isTaxaOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
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
            )}
          </div>

          {/* Illustrator Filter */}
          <div>
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsIllustratorOpen(!isIllustratorOpen)}>
              <label className="text-sm font-medium">Filter by Illustrator</label>
              <div className="flex items-center gap-2">
                {selectedIllustrators.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setSelectedIllustrators([]); }} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                )}
                <span className="text-sm">{isIllustratorOpen ? '−' : '+'}</span>
              </div>
            </div>

            {isIllustratorOpen && (
              <div className="flex flex-wrap gap-2 bg-white/10 p-2 rounded overflow-y-auto">
                {illustratorOptions.map((illustrator) => (
                  <button
                    key={illustrator}
                    onClick={() => {
                      setSelectedIllustrators((prev) =>
                        prev.includes(illustrator)
                          ? prev.filter((i) => i !== illustrator)
                          : [...prev, illustrator]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${selectedIllustrators.includes(illustrator)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/20 text-white border border-white/20'
                      }`}
                  >
                    {illustrator}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </aside>
  );
}