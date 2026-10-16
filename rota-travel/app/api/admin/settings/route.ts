import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
export const dynamic='force-dynamic';
const DEFAULTS={siteName:'Rota Seyahat',supportEmail:'merhaba@rota.example',phone:'444 28 22',currency:'TRY'};
const schema=z.object({siteName:z.string().min(2).max(100),supportEmail:z.string().email(),phone:z.string().min(3).max(40),currency:z.enum(['TRY','EUR','USD'])});
export async function GET(){try{const rows=await prisma.siteSetting.findMany({where:{key:{in:Object.keys(DEFAULTS)}}});const settings:any={...DEFAULTS};for(const row of rows){const value=row.value as {text?:string}|null;if(value?.text&&row.key in settings)settings[row.key]=value.text;}return NextResponse.json({settings,mode:'database'});}catch{return NextResponse.json({settings:DEFAULTS,mode:'demo'});}}
export async function PUT(req:Request){try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Ayar alanlarını kontrol edin.'},{status:400});const entries=Object.entries(parsed.data) as [keyof typeof DEFAULTS,string][];await prisma.$transaction(entries.map(([key,value])=>prisma.siteSetting.upsert({where:{key},update:{value:{text:value} as Prisma.InputJsonValue},create:{key,value:{text:value} as Prisma.InputJsonValue}})));return NextResponse.json({ok:true,settings:parsed.data,mode:'database'});}catch{return NextResponse.json({error:'Ayarlar kaydedilemedi. PostgreSQL bağlantısını kontrol edin.'},{status:503});}}
