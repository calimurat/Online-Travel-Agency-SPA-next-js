import { prisma } from '@/lib/prisma';
import { hotels as demoHotels, tours as demoTours, campaigns as demoCampaigns } from '@/lib/demo-data';
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/site-content';

export async function getHotels() {
  try {
    const rows = await prisma.hotel.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }] });
    return rows.map(row => ({ ...row, rating: Number(row.rating), oldPrice: row.oldPrice ?? null }));
  } catch { /* local demo mode if PostgreSQL is not configured */ }
  return demoHotels;
}

export async function getTours() {
  try {
    const rows = await prisma.tour.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }] });
    return rows.map(row => ({ ...row, oldPrice: row.oldPrice ?? null }));
  } catch { /* local demo mode if PostgreSQL is not configured */ }
  return demoTours;
}

export async function getCampaigns() {
  try {
    const rows = await prisma.campaign.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }] });
    return rows.map(row => ({ ...row, discount: row.discount ?? undefined }));
  } catch { /* local demo mode if PostgreSQL is not configured */ }
  return demoCampaigns;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(DEFAULT_SITE_CONTENT) } } });
    const content: SiteContent = { ...DEFAULT_SITE_CONTENT };
    for (const row of rows) {
      const value = row.value as { text?: string } | null;
      if (value?.text && row.key in content) content[row.key as keyof SiteContent] = value.text;
    }
    return content;
  } catch { /* local demo mode if PostgreSQL is not configured */ }
  return DEFAULT_SITE_CONTENT;
}
