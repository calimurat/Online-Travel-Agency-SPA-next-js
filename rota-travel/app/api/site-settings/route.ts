import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
const defaults = { siteName: 'Rota Seyahat', supportEmail: 'merhaba@rota.example', phone: '444 28 22', currency: 'TRY' };
export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(defaults) } } });
    const settings: Record<string, string> = { ...defaults };
    for (const row of rows) {
      const value = row.value as { text?: string } | null;
      if (value?.text && row.key in settings) settings[row.key] = value.text;
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: defaults });
  }
}
