'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';
import { Menu, X } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import Sidebar from '../components/Sidebar';
import type { CryptidCampCard } from '../types/Card';
import Image from 'next/image';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRoutingToCard, setIsRoutingToCard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedType, setSelectedType] = useState('');
  const [selectedCabin, setSelectedCabin] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [costRange, setCostRange] = useState<[number, number]>([0, 5]);

  const itemsPerPage = 12;
  const loaderRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const type = searchParams.get('type') || '';
    const cabin = searchParams.get('cabin') || '';
    const rarity = searchParams.get('rarity') || '';
    const taxa = searchParams.get('taxa')?.split(',') || [];
    const search = searchParams.get('search') || '';
    const costMin = Number(searchParams.get('costMin') || '0');
    const costMax = Number(searchParams.get('costMax') || '5');

    setSelectedType(type);
    setSelectedCabin(cabin);
    setSelectedRarity(rarity);
    setSelectedTaxa(taxa);
    setInputValue(search);
    setSearchQuery(search);
    setCostRange([costMin, costMax]);
    setFiltersLoaded(true);
  }, [searchParams.toString()]);

  useEffect(() => {
    if (filtersLoaded) {
      fetchCards(true);
    }
  }, [filtersLoaded, selectedType, selectedCabin, selectedRarity, selectedTaxa, costRange, searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        fetchCards();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const fetchCards = async (reset = false) => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    queryParams.set('offset', reset ? '0' : String(offset));
    queryParams.set('limit', String(itemsPerPage));

    if (selectedTaxa.length > 0) queryParams.set('taxa', selectedTaxa.join(','));
    if (selectedType) queryParams.set('type', selectedType);
    if (selectedCabin) queryParams.set('cabin', selectedCabin);
    if (selectedRarity) queryParams.set('rarity', selectedRarity);
    queryParams.set('costMin', String(costRange[0]));
    queryParams.set('costMax', String(costRange[1]));
    if (searchQuery) queryParams.set('search', searchQuery);

    const res = await fetch(`/api/cards?${queryParams.toString()}`);
    const data = await res.json();

    const sorted = data.sort((a: CryptidCampCard, b: CryptidCampCard) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );

    if (reset) {
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

    setLoading(false);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (selectedCabin) params.set('cabin', selectedCabin);
    if (selectedRarity) params.set('rarity', selectedRarity);
    if (selectedTaxa.length > 0) params.set('taxa', selectedTaxa.join(','));
    if (searchQuery) params.set('search', searchQuery);
    params.set('costMin', String(costRange[0]));
    params.set('costMax', String(costRange[1]));

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });

    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedCabin('');
    setSelectedRarity('');
    setSelectedTaxa([]);
    setInputValue('');
    setSearchQuery('');
    setCostRange([0, 5]);
    setHasMore(true);
    setOffset(0);

    startTransition(() => {
      router.push('/');
    });
  };

  useEffect(() => {
    if (filtersLoaded && !isMobile && searchParams.toString()) {
      applyFilters();
    }
  }, [filtersLoaded, isMobile]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300); // Show button if scrolled down 300px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-800 relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
          key={`${selectedType}-${selectedCabin}-${selectedRarity}-${selectedTaxa.join(',')}-${costRange.join(',')}-${inputValue}`}
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
        {isMobile && (
          <div className="md:hidden px-4 pb-4 bg-white border-t pt-4 space-y-2">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded shadow hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 flex md:hidden justify-between items-center p-4 border-b shadow bg-white z-30">
        <h1 className="text-xl font-bold">Cryptid Camp Codex</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }}
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

        <div className="relative z-20 p-8">
          {loading && cards.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600"></div>
            </div>
          ) : cards.length === 0 ? (
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
              <CardGrid
                cards={cards}
                currentPage={1}
                onCardClickStart={() => setIsRoutingToCard(true)}
                filters={{
                  type: selectedType,
                  cabin: selectedCabin,
                  rarity: selectedRarity,
                  taxa: selectedTaxa,
                  search: inputValue,
                  costRange: costRange,
                }}
              />
              <div ref={loaderRef} className="h-16"></div>
              {loading && <p className="text-center my-4">Loading more cards...</p>}
            </>
          )}
        </div>

        {(isPending || isRoutingToCard) && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </main>
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
