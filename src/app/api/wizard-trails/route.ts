// app/api/wizard-trails/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const [rows] = await db.query(`
    SELECT c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin cabin ON c.cabin_id = cabin.id
    WHERE c.is_trail = 1
    ORDER BY c.name ASC
  `);
  return NextResponse.json(rows);
}
