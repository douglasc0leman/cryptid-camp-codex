'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { CryptidCampCard } from '@/app/types/Card'; // adjust if path differs

type Props = {
  card: CryptidCampCard;
};

export default function HoloCard({ card }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardEl.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[300px] h-[420px] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-out"
      style={{ willChange: 'transform' }}
    >
      {/* Rainbow shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,0,255,0.2), rgba(0,255,255,0.2))',
          mixBlendMode: 'screen',
        }}
      />

      {/* Dynamic card image from Cloudinary */}
      <Image
        src={card.watermark_url!}
        alt={card.name}
        fill
        className="object-cover rounded-lg pointer-events-none"
        unoptimized // Remove if your domain is added to next.config.js
      />

      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          maskImage: '-webkit-radial-gradient(center, white, black)',
        }}
      >
        <div
          className="glare"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '500px',
            height: '500px',
            background:
              'linear-gradient(0deg, rgba(255,255,255,0) 0%, white 100%)',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        ></div>
      </div>
    </div>
  );
}
