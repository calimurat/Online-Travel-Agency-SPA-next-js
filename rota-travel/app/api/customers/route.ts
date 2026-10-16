import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
const demo = [
  { id: 'C-00824', name: 'Elif Yılmaz', email: 'elif.yilmaz@example.com', phone: '+90 532 111 22 33', bookings: 1, spend: 33800, joined: '2026-09-02', status: 'Aktif' },
  { id: 'C-00825', name: 'Mert Demir', email: 'mert.demir@example.com', phone: '+90 533 224 35 46', bookings: 1, spend: 77800, joined: '2026-09-18', status: 'Aktif' },
  { id: 'C-00826', name: 'Zeynep Kaya', email: 'zeynep.kaya@example.com', phone: '+90 534 125 89 14', bookings: 1, spend: 12400, joined: '2026-09-25', status: 'Aktif' },
  { id: 'C-00827', name: 'Can Arslan', email: 'can.arslan@example.com', phone: '+90 535 632 12 47', bookings: 1, spend: 55800, joined: '2026-09-30', status: 'Pasif' },
  { id: 'C-00828', name: 'Deniz Şahin', email: 'deniz.sahin@example.com', phone: '+90 536 789 44 18', bookings: 1, spend: 29400, joined: '2026-10-04', status: 'Aktif' },
];
export async function GET() {
  try {
    const rows = await prisma.customer.findMany({ include: { bookings: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ items: rows.map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone || '',
      bookings: c.bookings.length,
      spend: c.bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + b.totalAmount, 0),
      joined: c.createdAt.toISOString().slice(0, 10),
      status: c.bookings.some(b => b.status === 'CONFIRMED' || b.status === 'PENDING') ? 'Aktif' : 'Pasif',
    })), mode: 'database' });
  } catch {
    return NextResponse.json({ items: demo, mode: 'demo' });
  }
}
