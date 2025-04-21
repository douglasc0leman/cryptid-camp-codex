import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { RowDataPacket } from 'mysql2'
import { CryptidCampCard } from '@/app/types/Card'
import CardDetail from '@/app/components/CardDetail'

type CardRow = CryptidCampCard & RowDataPacket

// 🧠 No custom PageProps, no Awaited, no `any`
export default async function Page({ params }: { params: { id: string } }) {
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

  return <CardDetail card={card} />
}
