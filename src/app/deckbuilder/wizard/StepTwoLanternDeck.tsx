'use client';

import { useEffect, useState } from 'react';
import { CryptidCampCard } from '@/app/types/Card';
import Image from 'next/image';

type LanternEntry = {
  card: CryptidCampCard;
  count: number;
};

type Props = {
  lanternDeck: LanternEntry[];
  setLanternDeck: React.Dispatch<React.SetStateAction<LanternEntry[]>>;
  onBack: () => void;
  onNext: () => void;
};

export default function StepTwoLanternDeck({
  lanternDeck,
  setLanternDeck,
  onBack,
  onNext
}: Props) {
  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [loading, setLoading] = useState(true);

  const totalCount = lanternDeck.reduce((sum, entry) => sum + entry.count, 0);

  useEffect(() => {
    const fetchLanterns = async () => {
      setLoading(true);
      const res = await fetch('/api/wizard-lanterns?type=lantern&sort=name_asc');
      const data = await res.json();

      const sorted = [...data].sort((a, b) =>
        b.is_special_lantern ? 1 : a.is_special_lantern ? -1 : 0
      );

      setCards(sorted);
      setLoading(false);
    };

    fetchLanterns();
  }, []);

  const updateLanternDeck = (card: CryptidCampCard, newCount: number) => {
    setLanternDeck((prev) => {
      const existing = prev.find((entry) => entry.card.id === card.id);
      if (existing) {
        return prev.map((entry) =>
          entry.card.id === card.id ? { ...entry, count: newCount } : entry
        );
      } else {
        return [...prev, { card, count: newCount }];
      }
    });
  };

  const handleCountChange = (card: CryptidCampCard, input: number) => {
    const entry = lanternDeck.find((e) => e.card.id === card.id);
    const current = entry?.count || 0;
    const isSpecial = card.is_special_lantern === true;

    const maxForThisCard = isSpecial ? 2 : 10 - totalCount + current;
    const clamped = Math.max(0, Math.min(input, maxForThisCard));

    // Don't update if result would exceed total cap
    const projectedTotal = totalCount - current + clamped;
    if (projectedTotal > 10) return;

    updateLanternDeck(card, clamped);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Build Your Lantern Deck</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white" />
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-white text-center">
            Total Lanterns Selected: <span className="font-semibold">{totalCount}/10</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

            {cards.map((card) => {
              const entry = lanternDeck.find((e) => e.card.id === card.id);
              const count = entry?.count || 0;
              const isSpecial = card.is_special_lantern;

              const remaining = 10 - totalCount + count;
              const maxInput = isSpecial ? 2 : Math.min(remaining, 10);

              return (
                <div key={card.id} className="relative bg-white/10 rounded shadow p-2">
                  <Image
                    src={card.watermark_url!}
                    alt={card.name}
                    width={300}
                    height={400}
                    className="rounded"
                  />
                  <input
                    type="number"
                    min={0}
                    max={maxInput}
                    value={count}
                    onChange={(e) => handleCountChange(card, Number(e.target.value))}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 text-center bg-white/80 text-black rounded shadow-sm border border-gray-300 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-white text-center">
            Total Lanterns Selected: <span className="font-semibold">{totalCount}/10</span>
          </p>
        </>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-5 py-2 bg-gray-600 text-white rounded">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={totalCount !== 10}
          className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
