// app/api/wizard-cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const rarity = url.searchParams.get('rarity');
  const sort = url.searchParams.get('sort') || 'name_asc';

  const whereClauses: string[] = [];
  const values: (string | number)[] = [];

  if (type) {
    const typeMap: Record<string, string> = {
      cryptid: 'is_cryptid',
      lantern: 'is_lantern',
      trail: 'is_trail',
      supply: 'is_supply',
      memory: 'is_memory',
      trap: 'is_trap',
      environment: 'is_environment',
      czo: 'is_czo',
      'special lantern': 'is_special_lantern',
    };
    const key = type.toLowerCase();
    if (typeMap[key]) {
      whereClauses.push(`c.${typeMap[key]} = 1`);
    }
  }

  if (rarity) {
    const allowedRarities = ['common', 'uncommon', 'rare', 'unique'];
    if (allowedRarities.includes(rarity)) {
      whereClauses.push(`c.is_${rarity} = 1`);
    }
  }

  let query = `
    SELECT c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin ON c.cabin_id = cabin.id
  `;

  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  switch (sort) {
    case 'name_asc':
      query += ' ORDER BY LOWER(c.name) ASC';
      break;
    case 'name_desc':
      query += ' ORDER BY LOWER(c.name) DESC';
      break;
    default:
      query += ' ORDER BY LOWER(c.name) ASC';
  }

  const [rows] = await db.query<RowDataPacket[]>(query, values);
  return NextResponse.json(rows);
}