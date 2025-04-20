import { db } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { RowDataPacket } from 'mysql2'
import { CryptidCampCard } from '@/app/types/Card'
import CardImage from '@/app/components/CardImage'

type CardRow = CryptidCampCard & RowDataPacket

export default async function CardDetailPage({ params }: { params: { id: string } }) {
  const [rows] = await db.query<CardRow[]>(`
    SELECT 
      c.*, 
      cabin.name AS cabin 
    FROM Card c
    LEFT JOIN Cabin cabin ON c.cabin_id = cabin.id
    WHERE c.id = ?
    LIMIT 1
  `, [params.id])

  const card = rows[0] ?? null
  if (!card) return notFound()

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800 p-8">
      {/* Image Preview */}
      <div className="w-1/3 max-w-sm">
        <div className="bg-white p-4 shadow rounded">
          <CardImage src={card.image_url} alt={card.name} />
        </div>
      </div>

      {/* Card Details */}
      <div className="flex-1 ml-8">
        <h1 className="text-3xl font-bold mb-4">{card.name}</h1>

        <div className="space-y-2 text-sm leading-relaxed">
          <p><strong>Cabin:</strong> {card.cabin ?? 'Unknown'}</p>
          <p><strong>Cost:</strong> {card.cost ?? 'N/A'}</p>
          <p><strong>Rarity:</strong> {
            card.is_unique ? 'Unique' :
            card.is_rare ? 'Rare' :
            card.is_uncommon ? 'Uncommon' :
            card.is_common ? 'Common' : 'Unknown'
          }</p>
          <p><strong>Type:</strong> {
            card.is_cryptid ? 'Cryptid' :
            card.is_lantern ? 'Lantern' :
            card.is_trail ? 'Trail' :
            card.is_memory ? 'Memory Trap' :
            card.is_supply ? 'Supply' :
            card.is_trap ? 'Trap' : 'Other'
          }</p>
          {card.attack !== null && <p><strong>Attack:</strong> {card.attack}</p>}
          {card.defense !== null && <p><strong>Defense:</strong> {card.defense}</p>}
          {card.advantage && <p><strong>Advantage:</strong> {card.advantage}</p>}
          {card.text_box && <p><strong>Text:</strong> {card.text_box}</p>}
          {card.sub_text && <p><strong>Sub Text:</strong> {card.sub_text}</p>}
          {card.taxon && <p><strong>Taxon:</strong> {card.taxon}</p>}
          {card.flavor_text && <p className="italic text-gray-600">"{card.flavor_text}"</p>}
          <p><strong>Set:</strong> {card.set_name} ({card.set_number})</p>
          {card.illustrator && <p><strong>Illustrator:</strong> {card.illustrator}</p>}
          <p><strong>Promo:</strong> {card.is_promo ? 'Yes' : 'No'}</p>
          <p><strong>Serialized:</strong> {card.can_be_serialized ? `Yes (${card.serialized_out_of})` : 'No'}</p>
        </div>

        <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">
          ← Back to Gallery
        </Link>
      </div>
    </div>
  )
}
