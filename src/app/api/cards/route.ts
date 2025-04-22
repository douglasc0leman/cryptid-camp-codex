import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const taxaQuery = url.searchParams.get('taxa')
  const taxa = taxaQuery ? taxaQuery.split(',') : []

  let query = `
    SELECT 
      c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
  `
  const whereClauses: string[] = []
  const values: string[] = [] // 👈 Fixed the 'any' issue here

  // Use AND instead of OR to require ALL selected taxa to match
  if (taxa.length > 0) {
    taxa.forEach((taxon) => {
      values.push(`%${taxon}%`)
      whereClauses.push(`c.taxon LIKE ?`)
    })
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(' AND ')
  }

  const [rows] = await db.query(query, values)

  return NextResponse.json(rows)
}
