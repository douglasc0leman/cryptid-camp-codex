// SelectableCardGrid.tsx
import React from 'react';
import { CryptidCampCard } from '../types/Card';

type SelectableCardGridProps = {
  cards: CryptidCampCard[];
  onCardClick: (card: CryptidCampCard) => void;
  selectedCardIds: string[];
};

export default function SelectableCardGrid({
  cards,
  onCardClick,
  selectedCardIds,
}: SelectableCardGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isSelected = selectedCardIds.includes(card.id);
        return (
          <div
            key={card.id}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden shadow ${
              isSelected ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => onCardClick(card)}
          >
            <img src={card.watermark_url!} alt={card.name} className="w-full h-auto" />
            <div className="p-2 text-center text-sm font-semibold">{card.name}</div>
          </div>
        );
      })}
    </div>
  );
}
