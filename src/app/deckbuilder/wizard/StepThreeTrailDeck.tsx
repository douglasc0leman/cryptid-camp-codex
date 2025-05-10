'use client';

import { useEffect, useState } from 'react';
import { CryptidCampCard } from '@/app/types/Card';
import Image from 'next/image';

export type TrailEntry = {
  card: CryptidCampCard;
  count: number;
};

type Props = {
  trailDeck: TrailEntry[];
  setTrailDeck: React.Dispatch<React.SetStateAction<TrailEntry[]>>;
  onBack: () => void;
  onNext: () => void;
};

export default function StepThreeTrailDeck({ trailDeck, setTrailDeck, onBack, onNext }: Props) {
  const [cards, setCards] = useState<CryptidCampCard[]>([]);
  const [loading, setLoading] = useState(true);

  const totalCount = trailDeck.reduce((sum, entry) => sum + entry.count, 0);

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);
      const res = await fetch('/api/wizard-trails?type=trail&sort=name_asc');
      const data = await res.json();
      setCards(data);
      setLoading(false);
    };
    fetchTrails();
  }, []);

  const getMaxCountForRarity = (card: CryptidCampCard): number => {
    if (card.is_unique) return 1;
    if (card.is_rare) return 2;
    if (card.is_common) return 4;
    return 3; // default to uncommon
  };

  const handleCountChange = (card: CryptidCampCard, count: number) => {
    const max = getMaxCountForRarity(card);
    if (count < 0 || count > max) return;

    const entry = trailDeck.find((e) => e.card.id === card.id);
    const currentCount = entry?.count || 0;
    const proposedTotal = totalCount - currentCount + count;

    if (proposedTotal > 6) return;

    setTrailDeck((prev: TrailEntry[]) => {
      const existing = prev.find((entry) => entry.card.id === card.id);
      if (existing) {
        return prev.map((entry) =>
          entry.card.id === card.id ? { ...entry, count } : entry
        );
      } else {
        return [...prev, { card, count }];
      }
    });
  };


  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 3: Build Your Trail Deck</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white" />
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-white text-center">
            Total Trails Selected: <span className="font-semibold">{totalCount}/6</span>
          </p>
          <div className="flex flex-col gap-4">
            {cards.map((card) => {
              const entry = trailDeck.find((entry) => entry.card.id === card.id);
              const count = entry?.count || 0;
              const max = getMaxCountForRarity(card);

              return (
                <div
                  key={card.id}
                  className="w-full aspect-[16/9] relative bg-black overflow-hidden rounded"
                >
                  <div className="absolute inset-0 origin-center transform rotate-[270deg] scale-[1.6]">
                    <Image
                      src={card.watermark_url!}
                      alt={card.name}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-white/80 text-black rounded px-2 py-1 shadow-sm">
                    <button
                      onPointerDown={() => handleCountChange(card, count - 1)}
                      className="px-2 text-lg font-bold hover:text-red-600"
                      disabled={count <= 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={max}
                      value={count}
                      onChange={(e) => handleCountChange(card, Number(e.target.value))}
                      className="w-12 text-center bg-transparent outline-none"
                    />
                    <button
                      onPointerDown={() => handleCountChange(card, count + 1)}
                      className="px-2 text-lg font-bold hover:text-green-600"
                      disabled={count >= max || totalCount >= 6}
                    >
                      +
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-white text-center">
            Total Trails Selected: <span className="font-semibold">{totalCount}/6</span>
          </p>
        </>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-5 py-2 bg-gray-600 text-white rounded">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={totalCount !== 6}
          className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
