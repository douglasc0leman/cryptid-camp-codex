'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { X } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import Sidebar from '../components/Sidebar';
import type { CryptidCampCard } from '../types/Card';
import Image from 'next/image';
import { useScrollToTopOnFiltersChange } from '@/hooks/useScrollToTopOnFiltersChange';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function HomeClient() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [isRoutingToCard, setIsRoutingToCard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string[]>([]);
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'effect' | 'both'>('both');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [costRange, setCostRange] = useState<[number, number]>([0, 6]);

  const filters = {
    type: selectedType,
    cabin: selectedCabin,
    rarity: selectedRarity,
    set: selectedSet,
    taxa: selectedTaxa,
    weather: selectedWeather,
    traits: selectedTraits,
    search: searchQuery,
    costRange,
  };

  useScrollToTopOnFiltersChange(filters);

  const itemsPerPage = 12;
  const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'cost_asc' | 'cost_desc' | 'set_number_asc' | 'set_number_desc'>('name_asc');

  const loaderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [isFetchingCards, setIsFetchingCards] = useState(false);
  const [pendingUrlFilters, setPendingUrlFilters] = useState('');
  const debouncedUrlFilters = useDebounce(pendingUrlFilters, 400);

  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const type = searchParams.get('type')?.split(',') || [];
    const cabin = searchParams.get('cabin')?.split(',') || [];
    const rarity = searchParams.get('rarity')?.split(',') || [];
    const set = searchParams.get('set')?.split(',') || [];
    const taxa = searchParams.get('taxa')?.split(',') || [];
    const weather = searchParams.get('weather')?.split(',') || [];
    const traits = searchParams.get('traits')?.split(',') || [];
    const search = searchParams.get('search') || '';
    const costMin = Number(searchParams.get('costMin') || '0');
    const costMax = Number(searchParams.get('costMax') || '6');
    setSelectedType(type);
    setSelectedCabin(cabin);
    setSelectedRarity(rarity);
    setSelectedSet(set);
    setSelectedTaxa(taxa);
    setSelectedWeather(weather);
    setSelectedTraits(traits);
    setSearchQuery(search);
    setCostRange([costMin, costMax]);
    setFiltersLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    if (!filtersLoaded) return;

    const params = new URLSearchParams();
    if (selectedType.length > 0) params.set('type', selectedType.join(','));
    if (selectedCabin.length > 0) params.set('cabin', selectedCabin.join(','));
    if (selectedRarity.length > 0) params.set('rarity', selectedRarity.join(','));
    if (selectedSet.length > 0) params.set('set', selectedSet.join(','));
    if (selectedTaxa.length > 0) params.set('taxa', selectedTaxa.join(','));
    if (selectedWeather.length > 0) params.set('weather', selectedWeather.join(','));
    if (selectedTraits.length > 0) params.set('traits', selectedTraits.join(','));
    if (searchQuery) params.set('search', searchQuery);
    params.set('sort', sortOption);
    params.set('costMin', String(costRange[0]));
    params.set('costMax', String(costRange[1]));

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';

    setPendingUrlFilters(newUrl);
  }, [filtersLoaded, selectedType, selectedCabin, selectedRarity, selectedSet, selectedTaxa, selectedWeather, selectedTraits, searchQuery, costRange]);

  useEffect(() => {
    if (!filtersLoaded || !debouncedUrlFilters) return;

    const fetchAllCardIds = async () => {
      const res = await fetch(`/api/card-ids${debouncedUrlFilters}`);
      const allIds = await res.json();
      sessionStorage.setItem('visibleCardIds', JSON.stringify(allIds));
    };

    fetchAllCardIds();
  }, [debouncedUrlFilters, filtersLoaded]);

  useEffect(() => {
    if (!filtersLoaded) return;
    if (!debouncedUrlFilters) return;

    startTransition(() => {
      window.history.replaceState(null, '', debouncedUrlFilters);
    });
  }, [debouncedUrlFilters, filtersLoaded, startTransition, router]);

  useEffect(() => {
    if (!filtersLoaded) return;
    if (isPending) return;

    fetchCards(true);
  }, [filtersLoaded, isPending, selectedType, selectedCabin, selectedRarity, selectedSet, selectedTaxa, selectedWeather, selectedTraits, costRange, debouncedSearchQuery || '',
    searchMode || 'both',
    sortOption || 'name_asc']);

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

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clearFilters = () => {
    setSelectedType([]);
    setSelectedCabin([]);
    setSelectedRarity([]);
    setSelectedSet([]);
    setSelectedTaxa([]);
    setSelectedWeather([]);
    setSelectedTraits([]);
    setSearchQuery('');
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

  const fetchCards = async (reset = false) => {
    setIsFetchingCards(true);

    if (spinnerTimeoutRef.current) clearTimeout(spinnerTimeoutRef.current);

    const queryParams = new URLSearchParams();
    queryParams.set('offset', reset ? '0' : String(offset));
    queryParams.set('limit', String(itemsPerPage));
    if (selectedTaxa.length > 0) queryParams.set('taxa', selectedTaxa.join(','));
    if (selectedWeather.length > 0) queryParams.set('weather', selectedWeather.join(','));
    if (selectedTraits.length > 0) queryParams.set('traits', selectedTraits.join(','));
    if (selectedType.length > 0) queryParams.set('type', selectedType.join(','));
    if (selectedCabin.length > 0) queryParams.set('cabin', selectedCabin.join(','));
    if (selectedRarity.length > 0) queryParams.set('rarity', selectedRarity.join(','));
    if (selectedSet.length > 0) queryParams.set('set', selectedSet.join(','));
    if (debouncedSearchQuery) {
      if (searchMode === 'name') queryParams.set('search', debouncedSearchQuery);
      else if (searchMode === 'effect') queryParams.set('effect', debouncedSearchQuery);
      else queryParams.set('combinedSearch', debouncedSearchQuery);
    }

    queryParams.set('sort', sortOption);
    queryParams.set('costMin', String(costRange[0]));
    queryParams.set('costMax', String(costRange[1]));

    const res = await fetch(`/api/cards?${queryParams.toString()}`);
    const data = await res.json();

    let sorted = data;

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
      {/* Separate background for the sidebar */}
      {/* ✅ MOBILE SIDEBAR */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white bg-repeat-y transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          style={{ backgroundImage: "url('/images/sidebar-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none" />
          <div className="relative z-20 h-full overflow-y-auto">
            <Sidebar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCabin={selectedCabin}
              setSelectedCabin={setSelectedCabin}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              selectedSet={selectedSet}
              setSelectedSet={setSelectedSet}
              selectedTaxa={selectedTaxa}
              setSelectedTaxa={setSelectedTaxa}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              costRange={costRange}
              setCostRange={setCostRange}
              onClearFilters={clearFilters}
              selectedWeather={selectedWeather}
              setSelectedWeather={setSelectedWeather}
              selectedTraits={selectedTraits}
              setSelectedTraits={setSelectedTraits}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>
      )}

      {/* ✅ DESKTOP SIDEBAR */}
      {!isMobile && (
        <div
          className="fixed top-0 left-0 w-64 h-screen z-30 bg-white bg-repeat-y border-r border-gray-200"
          style={{ backgroundImage: "url('/images/sidebar-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none" />
          <div className="relative z-20 h-full">
            <Sidebar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCabin={selectedCabin}
              setSelectedCabin={setSelectedCabin}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              selectedSet={selectedSet}
              setSelectedSet={setSelectedSet}
              selectedTaxa={selectedTaxa}
              setSelectedTaxa={setSelectedTaxa}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              costRange={costRange}
              setCostRange={setCostRange}
              onClearFilters={clearFilters}
              selectedWeather={selectedWeather}
              setSelectedWeather={setSelectedWeather}
              selectedTraits={selectedTraits}
              setSelectedTraits={setSelectedTraits}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>
      )}


      <header className="fixed top-0 left-0 right-0 flex md:hidden justify-between items-center p-4 border-b shadow bg-white z-40">
        <h1 className="text-xl font-bold">Cryptid Camp Codex</h1>
        <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      <div
        className={`flex-1 relative overflow-y-auto pt-16 ${!isMobile ? 'ml-64' : ''}`}
        onClick={() => {
          if (window.innerWidth < 768 && isSidebarOpen) {
            setIsSidebarOpen(false);
          }
        }}
      >
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }} />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

        <div className="relative z-[30] p-8">
          {!isLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 sm:px-4 min-h-[50vh] auto-rows-fr place-items-start">
              {Array.from({ length: 8 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center text-gray-600 mt-16 text-lg flex flex-col items-center space-y-4">
              <Image src="/images/squonk.png" alt="Crying Squonk" width={200} height={200} className="opacity-80" />
              <p>No cards match your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <CardGrid
                cards={cards}
                currentPage={1}
                onCardClickStart={() => setIsRoutingToCard(true)}
                filters={{
                  type: selectedType,
                  cabin: selectedCabin,
                  rarity: selectedRarity,
                  set: selectedSet,
                  taxa: selectedTaxa,
                  weather: selectedWeather,
                  traits: selectedTraits,
                  search: searchQuery,
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
      </div>

      {isRoutingToCard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

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