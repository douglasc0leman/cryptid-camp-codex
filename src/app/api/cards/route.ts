import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort') || 'name_asc';
  const taxaQuery = url.searchParams.get('taxa');
  const taxa = taxaQuery ? taxaQuery.split(',') : [];
  const weather = url.searchParams.get('weather')?.split(',').filter(Boolean) || [];
  const traits = url.searchParams.get('traits')?.split(',').filter(Boolean) || [];
  const type = url.searchParams.get('type')?.split(',').filter(Boolean) || [];
  const rarity = url.searchParams.get('rarity')?.split(',').filter(Boolean) || [];
  const set = url.searchParams.get('set')?.split(',').filter(Boolean) || [];
  const cabin = url.searchParams.get('cabin')?.split(',').filter(Boolean) || [];
  const costMin = url.searchParams.get('costMin');
  const costMax = url.searchParams.get('costMax');
  const search = url.searchParams.get('search');
  const effect = url.searchParams.get('effect');
  const combinedSearch = url.searchParams.get('combinedSearch');

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
  
  if (type.length > 0) {
    const typeConditions: string[] = [];
    type.forEach((t) => {
      const key = t.toLowerCase();
      if (typeMap[key]) {
        typeConditions.push(`c.${typeMap[key]} = 1`);
      }
    });
    if (typeConditions.length > 0) {
      whereClauses.push(`(${typeConditions.join(' OR ')})`);
    }
  }  

  // Rarity filter
  const allowedRarities = ['common', 'uncommon', 'rare', 'unique'];
  if (rarity.length > 0) {
    const rarityConditions = rarity
      .filter((r) => allowedRarities.includes(r))
      .map((r) => `c.is_${r} = 1`);
    if (rarityConditions.length > 0) {
      whereClauses.push(`(${rarityConditions.join(' OR ')})`);
    }
  }  

  if (set.length > 0) {
    whereClauses.push(`c.set_name IN (${set.map(() => '?').join(', ')})`);
    values.push(...set);
  }

  // Cabin filter
  if (cabin.length > 0) {
    whereClauses.push(`LOWER(cabin.name) IN (${cabin.map(() => 'LOWER(?)').join(', ')})`);
    values.push(...cabin);
  }

  // Cost Range filter
  if (costMin !== null && costMax !== null) {
    if (costMin === costMax) {
      // Exact cost match
      whereClauses.push(`c.cost = ?`);
      values.push(Number(costMin));
    } else {
      if (costMin === '0' && costMax === '6') {
        // Default full range: include NULL costs
        whereClauses.push(`(c.cost IS NULL OR c.cost BETWEEN ? AND ?)`);
      } else {
        // Specific range: only BETWEEN
        whereClauses.push(`c.cost BETWEEN ? AND ?`);
      }
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

  // Combined search (name OR effect)
  if (combinedSearch) {
    whereClauses.push(`(c.name LIKE ? OR c.text_box LIKE ?)`);
    values.push(`%${combinedSearch}%`, `%${combinedSearch}%`);
  }

  // Weather filter
  if (weather.length > 0) {
    weather.forEach((w) => {
      whereClauses.push(`(c.text_box IS NOT NULL AND c.text_box LIKE ? OR c.name LIKE ?)`);
      values.push(`%${w}:%`, `%${w}%`);
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

  switch (sort) {
    case 'name_asc':
      query += ' ORDER BY LOWER(c.name) ASC';
      break;
    case 'name_desc':
      query += ' ORDER BY LOWER(c.name) DESC';
      break;
    case 'cost_asc':
      query += ' ORDER BY c.cost ASC';
      break;
    case 'cost_desc':
      query += ' ORDER BY c.cost DESC';
      break;
      case 'set_number_asc':
        query += `
          ORDER BY 
            CAST(SUBSTRING_INDEX(c.set_number, '/', -1) AS UNSIGNED) ASC,  -- total set size (e.g. 022 or 173)
            CAST(SUBSTRING_INDEX(c.set_number, '/', 1) AS UNSIGNED) ASC    -- actual card number (e.g. 004)
        `;
        break;
      
      case 'set_number_desc':
        query += `
          ORDER BY 
            CAST(SUBSTRING_INDEX(c.set_number, '/', -1) AS UNSIGNED) DESC,
            CAST(SUBSTRING_INDEX(c.set_number, '/', 1) AS UNSIGNED) DESC
        `;
        break;      
    default:
      query += ' ORDER BY c.name ASC';
  }
  
  query += ' LIMIT ? OFFSET ?';

  values.push(limit, offset);

  const [rows] = await db.query<RowDataPacket[]>(query, values);

  return NextResponse.json(rows);
}
