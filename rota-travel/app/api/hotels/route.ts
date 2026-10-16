import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hotels } from '@/lib/demo-data';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const hotelSchema = z.object({name:z.string().min(2),slug:z.string().min(2).regex(/^[a-z0-9-]+$/),location:z.string().min(2),region:z.string().min(2),description:z.string().min(5),image:z.string().url(),priceFrom:z.coerce.number().int().positive(),stars:z.coerce.number().int().min(1).max(5).optional(),boardType:z.string().optional(),tags:z.array(z.string()).optional(),status:z.enum(['DRAFT','PUBLISHED','ARCHIVED']).optional(),featured:z.boolean().optional()});
export async function GET(){try{const items=await prisma.hotel.findMany({orderBy:[{featured:'desc'},{updatedAt:'desc'}]});return NextResponse.json({items,mode:'database'});}catch{return NextResponse.json({items:hotels,mode:'demo',notice:'PostgreSQL bağlantısı bulunamadı; örnek veri gösteriliyor.'});}}
export async function POST(req:Request){try{const parsed=hotelSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Form alanlarını kontrol edin.',details:parsed.error.flatten()},{status:400});const item=await prisma.hotel.create({data:parsed.data});return NextResponse.json({item,mode:'database'},{status:201});}catch(e:any){if(e?.code==='P2002')return NextResponse.json({error:'Bu URL kısa adı zaten kullanılıyor.'},{status:409});return NextResponse.json({error:'Kayıt PostgreSQL veritabanına yazılamadı. DATABASE_URL ve migrasyonları kontrol edin.'},{status:503});}}
