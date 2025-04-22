import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { RowDataPacket } from 'mysql2'
import { CryptidCampCard } from '@/app/types/Card'
import CardDetail from '@/app/components/CardDetail'

type CardRow = CryptidCampCard & RowDataPacket

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [rows] = await db.query<CardRow[]>(`
    SELECT
      c.*,
      cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
    WHERE c.id = ?
    LIMIT 1
  `, [id]);

  const card = rows[0] ?? null
  if (!card) return notFound()

  return <CardDetail card={card} />
}