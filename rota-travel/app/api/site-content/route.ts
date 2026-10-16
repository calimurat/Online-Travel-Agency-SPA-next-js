import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(DEFAULT_SITE_CONTENT) } } });
    const content = { ...DEFAULT_SITE_CONTENT };
    for (const row of rows) {
      const value = row.value as { text?: string } | null;
      if (value?.text && row.key in content) content[row.key as keyof typeof content] = value.text;
    }
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: DEFAULT_SITE_CONTENT });
  }
}
