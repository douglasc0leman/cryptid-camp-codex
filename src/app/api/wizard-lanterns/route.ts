// app/api/wizard-lanterns/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // adjust path if needed
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const query = `
    SELECT c.*, cabin.name AS cabin
    FROM card c
    LEFT JOIN cabin ON c.cabin_id = cabin.id
    WHERE c.is_lantern = 1
    ORDER BY LOWER(c.name) ASC
  `;

  const [rows] = await db.query<RowDataPacket[]>(query);
  return NextResponse.json(rows);
}
