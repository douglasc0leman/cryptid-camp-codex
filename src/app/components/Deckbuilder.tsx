'use client';

import { useState } from 'react';
import StepOneCompanion from '../deckbuilder/wizard/StepOneCompanion';
import StepTwoLantern from '../deckbuilder/wizard/StepTwoLanternDeck';
import StepThreeTrailDeck from '../deckbuilder/wizard/StepThreeTrailDeck';
import { DeckBuilderProvider } from '../deckbuilder/wizard/useDeckBuilder';
import { CryptidCampCard } from '../types/Card';
import { useRouter } from 'next/navigation';
import StepFourMainDeck from '../deckbuilder/wizard/StepFourMainDeck';

export type LanternEntry = {
  card: CryptidCampCard;
  count: number;
};

export type TrailEntry = {
  card: CryptidCampCard;
  count: number;
};

export type MainDeckEntry = {
  card: CryptidCampCard;
  count: number;
};

export default function DeckBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lanternDeck, setLanternDeck] = useState<LanternEntry[]>([]);
  const [trailDeck, setTrailDeck] = useState<TrailEntry[]>([]);
  const [mainDeck, setMainDeck] = useState<MainDeckEntry[]>([]);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <DeckBuilderProvider>
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#0e1a2b]/80 backdrop-blur-md border-b border-white/10 shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Deck Builder</h1>
          <button
            onClick={() => router.push('/')}
          className="w-[40%] max-w-sm rounded-md px-5 py-3 text-sm font-semibold backdrop-blur-sm bg-white/10 text-white border border-white/20 shadow hover:bg-white/20 transition-all duration-200 tracking-wide text-center block"
        >
          Codex
        </button>
      </div>
    </header>
      <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Deck Builder</h1>

          {step === 1 && <StepOneCompanion onNext={goNext} />}
          {step === 2 && (
            <StepTwoLantern
              lanternDeck={lanternDeck}
              setLanternDeck={setLanternDeck}
              onBack={goBack}
              onNext={goNext}
            />
          )}
          {step === 3 && (
            <StepThreeTrailDeck
              trailDeck={trailDeck}
              setTrailDeck={setTrailDeck}
              onBack={goBack}
              onNext={goNext} 
            />
          )}
          {step === 4 && (
            <StepFourMainDeck
              mainDeck={mainDeck}
              setMainDeck={setMainDeck}
              onBack={goBack}
              onNext={goNext} 
            />
          )}
        </div>
      </div>
    </DeckBuilderProvider>
  );
}
