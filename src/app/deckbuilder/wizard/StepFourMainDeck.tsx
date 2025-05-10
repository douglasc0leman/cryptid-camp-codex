import { CryptidCampCard } from '@/app/types/Card';
import React from 'react'

type MainDeckEntry = {
  card: CryptidCampCard;
  count: number;
};

type Props = {
  mainDeck: MainDeckEntry[];
  setMainDeck: React.Dispatch<React.SetStateAction<MainDeckEntry[]>>;
  onBack: () => void;
  onNext: () => void;
};


export default function StepFourMainDeck ({
  mainDeck,
  setMainDeck,
  onBack,
  onNext
}: Props) {
  return (
    <div>StepFourMainDeck</div>
  )
}
