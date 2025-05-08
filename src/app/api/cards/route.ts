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

  const attackParam = url.searchParams.get('attack');
  const attack = attackParam !== null ? Number(attackParam) : null;
  const attackMin = Number(url.searchParams.get('attackMin'));
  const attackMax = Number(url.searchParams.get('attackMax'));

  const defenseParam = url.searchParams.get('defense');
  const defense = defenseParam !== null ? Number(defenseParam) : null;
  const defenseMin = Number(url.searchParams.get('defenseMin'));
  const defenseMax = Number(url.searchParams.get('defenseMax'));
  const illustrators = url.searchParams.get('illustrators')?.split(',').filter(Boolean) || [];

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
      whereClauses.push(`c.cost = ?`);
      values.push(Number(costMin));
    } else {
      if (costMin === '0' && costMax === '6') {
        whereClauses.push(`(c.cost IS NULL OR c.cost BETWEEN ? AND ?)`);
      } else {
        whereClauses.push(`c.cost BETWEEN ? AND ?`);
      }
      values.push(Number(costMin), Number(costMax));
    }
  }

  // Attack filter
  if (attack !== null && !isNaN(attack)) {
    whereClauses.push(`c.attack = ?`);
    values.push(attack);
  } else if (!isNaN(attackMin) && !isNaN(attackMax)) {
    const min = attackMin;
    const max = attackMax;
    if (min === 0 && max === 15) {
      whereClauses.push(`(c.attack IS NULL OR c.attack BETWEEN ? AND ?)`);
    } else {
      whereClauses.push(`c.attack BETWEEN ? AND ?`);
    }
    values.push(min, max);
  }

  // Defense filter
  if (defense !== null && !isNaN(defense)) {
    whereClauses.push(`c.defense = ?`);
    values.push(defense);
  } else if (!isNaN(defenseMin) && !isNaN(defenseMax)) {
    const min = defenseMin;
    const max = defenseMax;
    if (min === 0 && max === 15) {
      whereClauses.push(`(c.defense IS NULL OR c.defense BETWEEN ? AND ?)`);
    } else {
      whereClauses.push(`c.defense BETWEEN ? AND ?`);
    }
    values.push(min, max);
  }

  // Search by name
  if (search) {
    whereClauses.push(`c.name LIKE ?`);
    values.push(`%${search}%`);
  }

  // Search by effect
  if (effect) {
    whereClauses.push(`c.text_box LIKE ?`);
    values.push(`%${effect}%`);
  }

  // Combined search
  if (combinedSearch) {
    whereClauses.push(`(c.name LIKE ? OR c.text_box LIKE ?)`);
    values.push(`%${combinedSearch}%`, `%${combinedSearch}%`);
  }

  // Weather
  if (weather.length > 0) {
    weather.forEach((w) => {
      whereClauses.push(`(c.text_box IS NOT NULL AND c.text_box LIKE ? OR c.name LIKE ?)`);
      values.push(`%${w}:%`, `%${w}%`);
    });
  }

  // Traits
  if (traits.length > 0) {
    traits.forEach((trait) => {
      whereClauses.push(`c.text_box IS NOT NULL AND c.text_box LIKE ?`);
      values.push(`%${trait}%`);
    });
  }

  // Illustrators
  if (illustrators.length > 0) {
    whereClauses.push(`c.illustrator IN (${illustrators.map(() => '?').join(', ')})`);
    values.push(...illustrators);
  }  

  if (sort === 'atk_asc' || sort === 'atk_desc') {
    whereClauses.push('c.attack IS NOT NULL');
  }
  if (sort === 'def_asc' || sort === 'def_desc') {
    whereClauses.push('c.defense IS NOT NULL');
  }

  // Final WHERE clause
  if (whereClauses.length > 0) {
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  // Sort
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
          CAST(SUBSTRING_INDEX(c.set_number, '/', -1) AS UNSIGNED) ASC,
          CAST(SUBSTRING_INDEX(c.set_number, '/', 1) AS UNSIGNED) ASC
      `;
      break;
    case 'set_number_desc':
      query += `
        ORDER BY 
          CAST(SUBSTRING_INDEX(c.set_number, '/', -1) AS UNSIGNED) DESC,
          CAST(SUBSTRING_INDEX(c.set_number, '/', 1) AS UNSIGNED) DESC
      `;
      break;
    case 'atk_asc':
      query += ' ORDER BY c.attack ASC';
      break;
    case 'atk_desc':
      query += ' ORDER BY c.attack DESC';
      break;
    case 'def_asc':
      query += ' ORDER BY c.defense ASC';
      break;
    case 'def_desc':
      query += ' ORDER BY c.defense DESC';
      break;
    default:
      query += ' ORDER BY c.name ASC';
  }

  query += ' LIMIT ? OFFSET ?';
  values.push(limit, offset);

  const [rows] = await db.query<RowDataPacket[]>(query, values);
  return NextResponse.json(rows);
}
