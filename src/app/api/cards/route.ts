import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const taxaQuery = url.searchParams.get('taxa');
  const taxa = taxaQuery ? taxaQuery.split(',') : [];
  const weather = url.searchParams.get('weather')?.split(',').filter(Boolean) || [];
  const traits = url.searchParams.get('traits')?.split(',').filter(Boolean) || [];
  const type = url.searchParams.get('type');
  const rarity = url.searchParams.get('rarity');
  const set = url.searchParams.get('set');
  const cabin = url.searchParams.get('cabin');
  const costMin = url.searchParams.get('costMin');
  const costMax = url.searchParams.get('costMax');
  const search = url.searchParams.get('search');
  const effect = url.searchParams.get('effect');

  const offset = parseInt(url.searchParams.get('offset') || '0', 10);
  const limit = parseInt(url.searchParams.get('limit') || '12', 10);

  let query = `
    SELECT 
      c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
  `;

  const whereClauses: string[] = [];
  const values: (string | number)[] = [];

  // Taxa filter
  if (taxa.length > 0) {
    taxa.forEach((taxon) => {
      whereClauses.push(`c.taxon LIKE ?`);
      values.push(`%${taxon}%`);
    });
  }

  // Type filter
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
  
  const typeParam = type?.toLowerCase();
  if (typeParam && typeMap[typeParam]) {
    whereClauses.push(`c.${typeMap[typeParam]} = 1`);
  }

  // Rarity filter
  const allowedRarities = ['common', 'uncommon', 'rare', 'unique'];
  if (rarity && allowedRarities.includes(rarity)) {
    whereClauses.push(`c.is_${rarity} = 1`);
  }

  if (set) {
    whereClauses.push(`c.set_name = ?`);
    values.push(set);
  }

  // Cabin filter
  if (cabin) {
    whereClauses.push(`LOWER(cabin.name) = LOWER(?)`);
    values.push(cabin);
  }

  // Cost Range filter
  if (costMin !== null && costMax !== null) {
    if (costMin === costMax) {
      whereClauses.push(`c.cost = ?`);
      values.push(Number(costMin));
    } else {
      whereClauses.push(`(c.cost IS NULL OR c.cost BETWEEN ? AND ?)`);
      values.push(Number(costMin), Number(costMax));
    }
  }


  // Search by name filter
  if (search) {
    whereClauses.push(`c.name LIKE ?`);
    values.push(`%${search}%`);
  }

  // Search by effect filter
  if (effect) {
    whereClauses.push(`c.text_box LIKE ?`);
    values.push(`%${effect}%`);
  }

  // Weather filter
  if (weather.length > 0) {
    weather.forEach((w) => {
      whereClauses.push(`c.text_box IS NOT NULL AND c.text_box LIKE ?`);
      values.push(`%${w}:%`);
    });
  }

  // Traits filter
  if (traits.length > 0) {
    traits.forEach((trait) => {
      whereClauses.push(`c.text_box IS NOT NULL AND c.text_box LIKE ?`);
      values.push(`%${trait}%`);
    });
  }

  // Combine all WHERE clauses
  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  query += ' ORDER BY c.name ASC';
  query += ' LIMIT ? OFFSET ?';

  values.push(limit, offset);

  const [rows] = await db.query<RowDataPacket[]>(query, values);

  return NextResponse.json(rows);
}
