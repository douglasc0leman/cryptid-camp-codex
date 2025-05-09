'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CryptidCampCard } from '../../types/Card';

type DeckBuilderContextType = {
  selectedCompanion: CryptidCampCard | null;
  setSelectedCompanion: (card: CryptidCampCard | null) => void;
};

// 1. Create the context
const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(undefined);

// 2. Provider component
export const DeckBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCompanion, setSelectedCompanion] = useState<CryptidCampCard | null>(null);

  return (
<DeckBuilderContext.Provider value={{ selectedCompanion, setSelectedCompanion }}>
  {children}
</DeckBuilderContext.Provider>

  );
};

// 3. Hook to consume context
export const useDeckBuilder = () => {
  const context = useContext(DeckBuilderContext);
  if (!context) {
    throw new Error('useDeckBuilder must be used within a DeckBuilderProvider');
  }
  return context;
};
