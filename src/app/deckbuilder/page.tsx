import DeckBuilder from '../components/Deckbuilder';
import { DeckBuilderProvider } from './wizard/useDeckBuilder';

export default function DeckBuilderPage() {
  return (
    <DeckBuilderProvider>
      <DeckBuilder />
    </DeckBuilderProvider>
  );
}
