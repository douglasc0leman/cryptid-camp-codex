'use client';

import { useState } from 'react';
import StepOneCompanion from '../deckbuilder/wizard/StepOneCompanion';
import StepTwoLantern from '../deckbuilder/wizard/StepTwoLanternDeck';
import StepThreeTrailDeck from '../deckbuilder/wizard/StepThreeTrailDeck';
import { DeckBuilderProvider } from '../deckbuilder/wizard/useDeckBuilder';
import { CryptidCampCard } from '../types/Card';

export type LanternEntry = {
  card: CryptidCampCard;
  count: number;
};

export type TrailEntry = {
  card: CryptidCampCard;
  count: number;
};

export default function DeckBuilder() {
  const [step, setStep] = useState(1);
  const [lanternDeck, setLanternDeck] = useState<LanternEntry[]>([]);
  const [trailDeck, setTrailDeck] = useState<TrailEntry[]>([]);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <DeckBuilderProvider>
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
              onNext={goNext} // or replace with a "Finish" handler
            />
          )}
        </div>
      </div>
    </DeckBuilderProvider>
  );
}
