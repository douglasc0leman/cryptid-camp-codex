import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const taxaQuery = url.searchParams.get('taxa')
  const type = url.searchParams.get('type')
  const rarity = url.searchParams.get('rarity')
  const cabin = url.searchParams.get('cabin')
  const costMin = url.searchParams.get('costMin')
  const costMax = url.searchParams.get('costMax')
  const search = url.searchParams.get('search')

  const taxa = taxaQuery ? taxaQuery.split(',') : []

  let query = `
    SELECT 
      c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
  `

  const whereClauses: string[] = []
  const values: (string | number)[] = []

  // ✅ Taxa (AND logic)
  if (taxa.length > 0) {
    taxa.forEach((taxon) => {
      whereClauses.push(`c.taxon LIKE ?`)
      values.push(`%${taxon}%`)
    })
  }

  // ✅ Type (boolean column)
  const allowedTypes = ['cryptid', 'lantern', 'trail', 'supply', 'memory', 'trap', 'environment']
  if (type && allowedTypes.includes(type)) {
    whereClauses.push(`c.is_${type} = 1`)
  }

  // ✅ Rarity
  const allowedRarities = ['common', 'uncommon', 'rare', 'unique']
  if (rarity && allowedRarities.includes(rarity)) {
    whereClauses.push(`c.is_${rarity} = 1`)
  }

  // ✅ Cabin
  if (cabin) {
    whereClauses.push(`LOWER(cabin.name) = LOWER(?)`)
    values.push(cabin)
  }

  // ✅ Cost Range
  if (!(costMin === '0' && costMax === '5')) {
    whereClauses.push(`(c.cost IS NULL OR c.cost BETWEEN ? AND ?)`)
    values.push(Number(costMin), Number(costMax))
  }

  // ✅ Name search
  if (search) {
    whereClauses.push(`c.name LIKE ?`)
    values.push(`%${search}%`)
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ')
  }

  query += ' ORDER BY c.name ASC'

  const [rows] = await db.query(query, values as any)

  console.log('Executed Query:', query);
console.log('With Values:', values);
console.log('Result Count:', Array.isArray(rows) ? rows.length : 'not array');
  return NextResponse.json(rows)
}
