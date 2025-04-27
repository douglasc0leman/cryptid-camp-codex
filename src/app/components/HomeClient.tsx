'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { X } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import Sidebar from '../components/Sidebar';
import type { CryptidCampCard } from '../types/Card';
import Image from 'next/image';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [isRoutingToCard, setIsRoutingToCard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedType, setSelectedType] = useState('');
  const [selectedCabin, setSelectedCabin] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 400);
  const [searchEffectQuery, setSearchEffectQuery] = useState('');
  const debouncedEffectInput = useDebounce(searchEffectQuery, 400);

  const [costRange, setCostRange] = useState<[number, number]>([0, 6]);

  const itemsPerPage = 12;
  const loaderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [pendingUrlFilters, setPendingUrlFilters] = useState('');
  const debouncedUrlFilters = useDebounce(pendingUrlFilters, 400);

  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pull filters from URL
  useEffect(() => {
    const type = searchParams.get('type') || '';
    const cabin = searchParams.get('cabin') || '';
    const rarity = searchParams.get('rarity') || '';
    const taxa = searchParams.get('taxa')?.split(',') || [];
    const weather = searchParams.get('weather')?.split(',') || [];
    const search = searchParams.get('search') || '';
    const effect = searchParams.get('effect') || '';
    const costMin = Number(searchParams.get('costMin') || '0');
    const costMax = Number(searchParams.get('costMax') || '6');
    setSelectedType(type);
    setSelectedCabin(cabin);
    setSelectedRarity(rarity);
    setSelectedTaxa(taxa);
    setSelectedWeather(weather);
    setInputValue(search);
    setSearchEffectQuery(effect);
    setCostRange([costMin, costMax]);
    setFiltersLoaded(true);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    if (!filtersLoaded) return;

    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (selectedCabin) params.set('cabin', selectedCabin);
    if (selectedRarity) params.set('rarity', selectedRarity);
    if (selectedTaxa.length > 0) params.set('taxa', selectedTaxa.join(','));
    if (selectedWeather.length > 0) params.set('weather', selectedWeather.join(','));
    if (inputValue) params.set('search', inputValue);
    if (searchEffectQuery) params.set('effect', searchEffectQuery);
    params.set('costMin', String(costRange[0]));
    params.set('costMax', String(costRange[1]));

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';

    setPendingUrlFilters(newUrl);
  }, [filtersLoaded, selectedType, selectedCabin, selectedRarity, selectedTaxa, selectedWeather, inputValue, searchEffectQuery, costRange]);

  // Actually update URL
  useEffect(() => {
    if (!filtersLoaded) return;
    if (!debouncedUrlFilters) return;

    startTransition(() => {
        window.history.replaceState(null, '', debouncedUrlFilters);

    });
  }, [debouncedUrlFilters, filtersLoaded, startTransition, router]);

  // Fetch cards when filters change, but wait until router is stable
  useEffect(() => {
    if (!filtersLoaded) return;
    if (isPending) return;

    fetchCards(true);
  }, [filtersLoaded, isPending, selectedType, selectedCabin, selectedRarity, selectedTaxa, selectedWeather, costRange, debouncedInputValue, debouncedEffectInput]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingCards && hasMore) {
        fetchCards();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [isFetchingCards, hasMore]);

  // Scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear filters
  const clearFilters = () => {
    setSelectedType('');
    setSelectedCabin('');
    setSelectedRarity('');
    setSelectedTaxa([]);
    setSelectedWeather([]);
    setInputValue('');
    setSearchEffectQuery('');
    setCostRange([0, 6]);
    setHasMore(true);
    setOffset(0);

    startTransition(() => {
      router.push('/');
    });
  };

  function SkeletonCard() {
    return (
      <div className="w-full h-[320px] flex flex-col p-2 rounded shadow bg-gray-200 animate-pulse">
        <div className="w-full h-[220px] rounded bg-gray-300 mb-2" />
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
        <div className="h-3 w-1/2 bg-gray-300 rounded" />
      </div>
    );
  }

  // Main fetch
  const fetchCards = async (reset = false) => {
    setIsFetchingCards(true);

    if (spinnerTimeoutRef.current) clearTimeout(spinnerTimeoutRef.current);

    const queryParams = new URLSearchParams();
    queryParams.set('offset', reset ? '0' : String(offset));
    queryParams.set('limit', String(itemsPerPage));
    if (selectedTaxa.length > 0) queryParams.set('taxa', selectedTaxa.join(','));
    if (selectedWeather.length > 0) queryParams.set('weather', selectedWeather.join(','));
    if (selectedType) queryParams.set('type', selectedType);
    if (selectedCabin) queryParams.set('cabin', selectedCabin);
    if (selectedRarity) queryParams.set('rarity', selectedRarity);
    if (debouncedInputValue) queryParams.set('search', debouncedInputValue);
    if (debouncedEffectInput) queryParams.set('effect', debouncedEffectInput);

    queryParams.set('costMin', String(costRange[0]));
    queryParams.set('costMax', String(costRange[1]));

    const res = await fetch(`/api/cards?${queryParams.toString()}`);
    const data = await res.json();

    let sorted = data.sort((a: CryptidCampCard, b: CryptidCampCard) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    if (costRange[0] === 6 && costRange[1] === 6) {
      sorted = sorted.filter((card: CryptidCampCard) => card.cost === 6);
    }

    if (reset) {
      setIsLoaded(false);
      setCards(sorted);
      setOffset(itemsPerPage);
      setHasMore(sorted.length >= itemsPerPage);
    } else {
      setCards((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newCards = sorted.filter((c: CryptidCampCard) => !existingIds.has(c.id));
        return [...prev, ...newCards];
      });
      setOffset((prev) => prev + itemsPerPage);
      if (sorted.length < itemsPerPage) {
        setHasMore(false);
      }
    }

    setIsFetchingCards(false);
    if (spinnerTimeoutRef.current) clearTimeout(spinnerTimeoutRef.current);
    setIsLoaded(true); 
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-800 relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 w-64 md:w-auto bg-white md:bg-transparent h-full overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex md:hidden justify-between items-center p-4 border-b bg-white">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
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
          onClearFilters={clearFilters}
          selectedWeather={selectedWeather}
          setSelectedWeather={setSelectedWeather}
          searchEffectQuery={searchEffectQuery}
          setSearchEffectQuery={setSearchEffectQuery}
        />
      </div>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 flex md:hidden justify-between items-center p-4 border-b shadow bg-white z-30">
  <h1 className="text-xl font-bold">Cryptid Camp Codex</h1>
  <button onClick={() => setIsSidebarOpen(prev => !prev)}>
    {isSidebarOpen ? (
      <X className="w-6 h-6" />
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
</header>
      {/* Main */}
      <main className="flex-1 relative overflow-y-auto pt-16">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }} />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

        <div className="relative z-20 p-8">
          
        {!isLoaded ? (
  // While loading (skeleton)
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-4 auto-rows-fr">
    {Array.from({ length: 8 }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
) : cards.length === 0 ? (
  // After loading, if no matching cards
  <div className="text-center text-gray-600 mt-16 text-lg flex flex-col items-center space-y-4">
    <Image src="/images/squonk.png" alt="Crying Squonk" width={200} height={200} className="opacity-80" />
    <p>No cards match your search or filter criteria.</p>
  </div>
) : (
  // After loading, if cards available
  <>
    <CardGrid
      cards={cards}
      currentPage={1}
      onCardClickStart={() => setIsRoutingToCard(true)}
      filters={{
        type: selectedType,
        cabin: selectedCabin,
        rarity: selectedRarity,
        taxa: selectedTaxa,
        weather: selectedWeather,
        search: inputValue,
        effect: searchEffectQuery,
        costRange: costRange,
      }}
    />
    <div ref={loaderRef} className="h-16"></div>
    {isFetchingCards && cards.length > 0 && (
      <p className="text-center my-4">Loading more cards...</p>
    )}
  </>
)}
          
        </div>

        {/* Loading Overlay */}
        {(isRoutingToCard) && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </main>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-black/50 text-white rounded-full shadow-lg hover:bg-black/70 transition"
          aria-label="Scroll to Top"
        >
          <span className="text-2xl leading-none">↑</span>
        </button>
      )}
    </div>
  );
}
