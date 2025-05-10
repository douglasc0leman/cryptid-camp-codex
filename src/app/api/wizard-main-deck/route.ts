// app/api/wizard-others/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
    WHERE c.is_lantern = 0 AND c.is_trail = 0
    ORDER BY c.name ASC
  `);
  return NextResponse.json(rows);
}
