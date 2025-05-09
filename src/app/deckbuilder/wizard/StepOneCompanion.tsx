'use client';

import { useDeckBuilder } from './useDeckBuilder';
import { CryptidCampCard } from '@/app/types/Card';
import SelectableCardGrid from '@/app/components/SelectableCardGrid';
import { useEffect, useState } from 'react';

export default function StepOneCompanion({ onNext }: { onNext: () => void }) {
  const { selectedCompanion, setSelectedCompanion } = useDeckBuilder();
const [loading, setLoading] = useState(true);
const [cards, setCards] = useState<CryptidCampCard[]>([]);

useEffect(() => {
  const fetchCompanions = async () => {
    setLoading(true);
    const res = await fetch('/api/wizard-companions?type=cryptid&rarity=unique&sort=name_asc');
    const data = await res.json();
    setCards(data);
    setLoading(false);
  };

  fetchCompanions();
}, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 1: Choose Your Companion</h2>

{loading ? (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
  </div>
) : (
  <SelectableCardGrid
    cards={cards}
    selectedCardIds={selectedCompanion ? [selectedCompanion.id] : []}
onCardClick={(card) =>
  setSelectedCompanion(
    selectedCompanion?.id === card.id ? null : card
  )
}
  />
)}


      <div className="mt-4 flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedCompanion}
          className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}
