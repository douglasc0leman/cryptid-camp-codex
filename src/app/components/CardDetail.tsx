'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CryptidCampCard } from '@/app/types/Card';
import { Search } from 'lucide-react';
import { cabinColorMap } from '../utils/cabinStyles';

export default function CardDetail({ card }: { card: CryptidCampCard }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const bgFromQuery = searchParams.get('bg') ?? '';
  const { bg, text } = cabinColorMap[bgFromQuery] ?? { bg: '#ffffff', text: 'text-gray-800' };

  const textClass = text;
  const cabin = card.cabin?.toLowerCase() || '';
  const needsDarkText = ['#eaf4ff', '#edf2f7', '#ffffff'].includes(bg.toLowerCase()) || ['meteorite', 'corallium', 'gem', 'fulgurite', 'quartz'].includes(cabin);

  const badgeMap: Record<string, string> = {
    Lapis: '/images/lapis.png', Obsidian: '/images/obsidian.png', Quartz: '/images/quartz.png',
    Corallium: '/images/corallium.png', Meteorite: '/images/meteorite.png',
    Fluorite: '/images/fluorite.png', Malachite: '/images/malachite.png', Fulgurite: '/images/fulgurite.png', Gem: '/images/gem.png'
  };

  function parseTextBox(text: string) {
    const weatherConditions = [
      'Clear Sky', 'Fog', 'Day', 'Night', 'Heat', 'Rain', 'Storm', 'Calm'
    ];

    const regex = new RegExp(`(${weatherConditions.join('|')}):`, 'g');
    const parts = text.split(regex);

    const elements: (string | { type: 'badge'; label: string })[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (weatherConditions.includes(part)) {
        elements.push({ type: 'badge', label: part });
      } else if (part.trim() !== '') {
        elements.push(part);
      }
    }

    return elements;
  }

  const backToCodexQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('bg');
    return params.toString();
  }, [searchParams]);

  const badgeSrc = badgeMap[card.cabin!];

  const taxons = useMemo(() => {
    if (!card.taxon) return [];

    const allTaxa = [
      'Alien', 'Angel', 'Anuran', 'Arachnid', 'Avian', 'Bovine', 'Canine', 'Caprid',
      'Celestial', 'Cervine', 'Cephalopod', 'Demon', 'Deity', 'Draconid', 'Dulcis',
      'Elemental', 'Equine', 'Fae', 'Ferus', 'Feline', 'Golem', 'Humanoid',
      'Impersator', 'Insectoid', 'Interloper', 'Invader', 'Lagomorph', 'Magus',
      'Mecha', 'Mer', 'Observer', 'Phantom', 'Piscis', 'Prophet', 'Revenant',
      'Rodent', 'Sanguivore', 'Sasquatch', 'Saurian', 'Serpent', 'Simian', 'Spirit',
      'Suid', 'Ursa', 'Vermis', 'Yokai'
    ];

    const splitTaxa = card.taxon.split(' ').filter(t => t.trim() !== '');

    if (splitTaxa.length === 2 && splitTaxa[0] === '{All' && splitTaxa[1] === 'Taxa}') {
      return allTaxa;
    }

    return splitTaxa;
  }, [card.taxon]);

  const isLandscape = card.is_trail || (card.is_supply && card.name.toLowerCase().includes('cabin'));

  return (
    <div className="min-h-screen relative bg-gray-100 p-6 md:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/cardgrid-bg.png')" }} />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md z-10" />

      <div className={`relative z-20 max-w-6xl mx-auto shadow-md rounded-lg overflow-hidden md:flex ${textClass}`} style={{ background: bg }}>
        {/* Left - Image */}
        <div className={`p-6 flex items-center justify-center border-r border-gray-200 ${isLandscape ? 'md:w-[48%]' : 'md:w-1/3'}`}>
          <button onClick={() => setIsModalOpen(true)} className="focus:outline-none">
            <div
              className={`relative group cursor-zoom-in transition-transform duration-200 transform hover:scale-105`}
              style={{
                width: isLandscape ? '540px' : '364px',
                height: isLandscape ? '360px' : '504px',
              }}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={card.watermark_url!}
                  alt={card.name}
                  fill
                  unoptimized
                  className={`object-contain rounded ${isLandscape ? 'rotate-[-90deg]' : ''}`}
                />
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Search className="w-8 h-8 text-white" />
              </div>
            </div>

          </button>
        </div>


        {/* Right - Details */}
        <div className="md:w-2/3 p-6 flex flex-col gap-4">
          {/* Mobile Badge */}
          {badgeSrc && (
            <div className="flex md:hidden flex-col items-center">
              <Image src={badgeSrc} alt={`${card.cabin} badge`} width={96} height={96} />
              <span className={`mt-2 text-lg font-extrabold tracking-wide uppercase ${textClass}`}>{card.cabin}</span>
            </div>
          )}

          {/* Header Info */}
          <div className="flex items-start gap-4">
          {card.cost !== null && (
              <Link
                href={`/?costMin=${card.cost}&costMax=${card.cost}`}
                className={`relative group w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-extrabold text-2xl shadow border transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${needsDarkText ? 'bg-gray-200 text-gray-800 border-gray-300' : 'bg-white/20 text-white border-white/30'}`}
              >
                {card.cost}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100">
                  Requires {card.cost} Vision
                </div>
              </Link>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight">
                {card.name}{' '}
                <span className="text-lg font-medium opacity-80">
                  ({card.is_cryptid ? 'Cryptid' : card.is_lantern ? 'Lantern' : card.is_trail ? 'Trail' : card.is_memory ? 'Memory' : card.is_trap ? 'Trap' : card.is_supply ? 'Supply' : 'Other'})
                </span>
              </h1>
              {card.sub_text && <p className="text-sm mt-1">{card.sub_text}</p>}
            </div>
          </div>

          {/* Rarity */}
          {(card.is_common || card.is_uncommon || card.is_rare || card.is_unique) && (
            <div className="text-sm">
              <span className="font-semibold">
                {card.is_unique ? 'Unique' : card.is_rare ? 'Rare' : card.is_uncommon ? 'Uncommon' : 'Common'}
              </span> – {card.is_unique ? 'You can have 1 copy per deck.' : card.is_rare ? 'You can have up to 2 copies per deck.' : card.is_uncommon ? 'You can have up to 3 copies per deck.' : 'You can have up to 4 copies per deck.'}
            </div>
          )}

          {/* Taxa */}
          {taxons.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {taxons.map(t => (
                <Link
                  key={t}
                  href={`/?taxa=${encodeURIComponent(t)}`}
                  className={`inline-block px-3 py-1 mx-1 rounded-full text-sm font-semibold align-middle cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${needsDarkText ? 'bg-gray-200 text-gray-800' : 'bg-white/20 text-white border border-white/20'}`}
                >
                  {t}
                </Link>
              ))}
            </div>
          )}


          {/* ATK/DEF + Advantage */}
          {(card.attack !== null || card.defense !== null) && (
            <div className="flex flex-col items-center justify-center w-full mt-6">
              <div className="inline-flex overflow-hidden rounded-full shadow text-white text-2xl font-bold">
                <div className="bg-red-200 text-red-900 px-6 py-3">{card.attack ?? 0} ATK</div>
                <div className="bg-blue-200 text-blue-900 px-6 py-3 border-l border-white/40">{card.defense ?? 0} DEF</div>
              </div>
              {card.advantage && (
                <div className="text-base font-semibold italic mt-3 text-center">{card.advantage}</div>
              )}
            </div>
          )}

          {/* Card Text */}
          {card.text_box && (
            <div className="text-[15px] leading-relaxed mt-4 whitespace-pre-wrap">
              {parseTextBox(card.text_box).map((part, idx) =>
                typeof part === 'string' ? (
                  <span key={idx}>{part}</span>
                ) : (
                  <span
                    key={idx}
                    onClick={() => {
                      const query = new URLSearchParams();
                      query.set('weather', part.label);
                      router.push(`/?${query.toString()}`);
                    }}
                    className={`inline-block px-3 py-1 mx-1 rounded-full text-sm font-semibold align-middle cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-md hover:shadow-indigo-400/40 ${needsDarkText ? 'bg-gray-200 text-gray-800' : 'bg-white/20 text-white border border-white/20'}`}
                  >
                    {part.label}
                  </span>
                )
              )}
            </div>
          )}


          {/* Illustrator, Set Name, Number */}
          {(card.illustrator || card.set_name || card.set_number) && (
            <div className="mt-8 text-sm font-medium space-y-1">
              {card.illustrator && <div>Illustrator: {card.illustrator}</div>}
              {card.set_name && <div>Set: {card.set_name}</div>}
              {card.set_number && <div>Card #: {card.set_number}</div>}
            </div>
          )}

          {/* Flavor Text */}
          {card.flavor_text && (
            <div className={`italic mt-8 border-l-4 pl-4 ${needsDarkText ? 'text-black/70 border-black/20' : 'text-white/70 border-white/40'}`}>
              “{card.flavor_text}”
            </div>
          )}

          {/* Back Button */}
          <div className="pt-10 pb-4 flex justify-center">
            <Link href={backToCodexQuery ? `/?${backToCodexQuery}` : '/'} className={`px-6 py-2 rounded-md font-semibold text-sm shadow ${needsDarkText ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              ← Back to Codex
            </Link>
          </div>
        </div>

        {/* Desktop Badge */}
        {badgeSrc && (
          <div className="hidden md:flex absolute top-4 right-4 flex-col items-center">
            <Image src={badgeSrc} alt={`${card.cabin} badge`} width={96} height={96} />
            <span className={`mt-2 text-lg font-extrabold tracking-wide uppercase ${textClass}`}>{card.cabin}</span>
          </div>
        )}
      </div>

      {/* Modal (separate, clean) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
            style={{
              width: isLandscape ? '720px' : '640px',
              height: isLandscape ? '540px' : '900px',
            }}
          >
            <Image
              src={card.watermark_url!}
              alt={card.name}
              fill
              unoptimized
              className={`rounded shadow-xl object-contain ${isLandscape ? 'rotate-[-90deg]' : ''}`}
            />
          </div>
        </div>
      )}

    </div>
  );
}
