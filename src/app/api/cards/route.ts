import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  const taxaQuery = url.searchParams.get('taxa')
  const type = url.searchParams.get('type')
  const rarity = url.searchParams.get('rarity')
  const cabin = url.searchParams.get('cabin')
  const costMin = url.searchParams.get('costMin')
  const costMax = url.searchParams.get('costMax')
  const search = url.searchParams.get('search')

  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const limit = parseInt(url.searchParams.get('limit') || '12', 10)

  const taxa = taxaQuery ? taxaQuery.split(',') : []

  let query = `
    SELECT 
      c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
  `

  const whereClauses: string[] = []
  const values: (string | number)[] = []

  // Taxa
  if (taxa.length > 0) {
    taxa.forEach((taxon) => {
      whereClauses.push(`c.taxon LIKE ?`)
      values.push(`%${taxon}%`)
    })
  }

  // Type
  const allowedTypes = ['cryptid', 'lantern', 'trail', 'supply', 'memory', 'trap', 'environment']
  if (type && allowedTypes.includes(type)) {
    whereClauses.push(`c.is_${type} = 1`)
  }

  // Rarity
  const allowedRarities = ['common', 'uncommon', 'rare', 'unique']
  if (rarity && allowedRarities.includes(rarity)) {
    whereClauses.push(`c.is_${rarity} = 1`)
  }

  // Cabin
  if (cabin) {
    whereClauses.push(`LOWER(cabin.name) = LOWER(?)`)
    values.push(cabin)
  }

  // Cost Range
  if (costMin !== null && costMax !== null) {
    if (costMin === '6' && costMax === '6') {
      // Only exact cost 6, no nulls
      whereClauses.push(`c.cost = 6`)
    } else {
      // Normal range, including NULL costs
      whereClauses.push(`(c.cost IS NULL OR c.cost BETWEEN ? AND ?)`)
      values.push(Number(costMin), Number(costMax))
    }
  }

  // Name search
  if (search) {
    whereClauses.push(`c.name LIKE ?`)
    values.push(`%${search}%`)
  }

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ')
  }

  query += ' ORDER BY c.name ASC'

  query += ' LIMIT ? OFFSET ?'
  values.push(limit, offset)

  const [rows] = await db.query<RowDataPacket[]>(query, values)

  return NextResponse.json(rows)
}
