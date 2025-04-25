// Improved to conditionally show filter buttons on mobile only, and auto-apply filters on desktop
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useTransition } from 'react';
import { Menu, X } from 'lucide-react';
import CardGrid from '../components/CardGrid';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';
import type { CryptidCampCard } from '../types/Card';
import Image from 'next/image';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRoutingToCard, setIsRoutingToCard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [selectedType, setSelectedType] = useState('');
  const [selectedCabin, setSelectedCabin] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [costRange, setCostRange] = useState<[number, number]>([0, 5]);

  const itemsPerPage = 12;

  const prevFilters = useRef({
    type: '',
    cabin: '',
    rarity: '',
    taxa: [] as string[],
    search: '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCards = async () => {
    setLoading(true);

    const queryParams = new URLSearchParams();

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

    setCards(sorted);
    setLoading(false);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (searchQuery) params.set('search', searchQuery);
    else params.delete('search');

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });

    prevFilters.current = {
      type: selectedType,
      cabin: selectedCabin,
      rarity: selectedRarity,
      taxa: selectedTaxa,
      search: searchQuery,
    };

    fetchCards();
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
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (!isMobile) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedCabin, selectedRarity, selectedTaxa, costRange, searchQuery]);

  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const start = (pageFromUrl - 1) * itemsPerPage;
  const pagedCards = cards.slice(start, start + itemsPerPage);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    if (searchQuery) params.set('search', searchQuery);

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-800 relative">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 w-64 md:w-auto bg-white md:bg-transparent h-full overflow-y-auto ${
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
        />
        {/* Filter Buttons - mobile only */}
        {isMobile && (
          <div className="md:hidden px-4 pb-4 bg-white border-t pt-4 space-y-2">
            <button
              onClick={applyFilters}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700"
            >
              Apply Filters
            </button>
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
      <header className="flex md:hidden justify-between items-center p-4 border-b shadow bg-white z-30">
        <h1 className="text-xl font-bold">Cryptid Camp Codex</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

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
              <div className="flex flex-col min-h-[calc(100vh-4rem)]">
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
  );
}
