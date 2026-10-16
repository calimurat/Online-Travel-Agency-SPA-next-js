import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_CONTENT } from '@/lib/site-content';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
export const dynamic='force-dynamic';
const schema=z.object({announcementText:z.string().min(2).max(180),heroTitle:z.string().min(2).max(100),heroEmphasis:z.string().min(2).max(100),heroSubtitle:z.string().min(2).max(260)});
export async function GET(){try{const rows=await prisma.siteSetting.findMany({where:{key:{in:Object.keys(DEFAULT_SITE_CONTENT)}}});const content:any={...DEFAULT_SITE_CONTENT};for(const row of rows){const stored=row.value as {text?:string}|null;if(stored?.text&&row.key in content)content[row.key]=stored.text;}return NextResponse.json({content,mode:'database'});}catch{return NextResponse.json({content:DEFAULT_SITE_CONTENT,mode:'demo',notice:'PostgreSQL bağlantısı yok; varsayılan içerik gösteriliyor.'});}}
export async function PUT(req:Request){try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'İçerik alanlarını kontrol edin.',details:parsed.error.flatten()},{status:400});const entries=Object.entries(parsed.data) as [keyof typeof DEFAULT_SITE_CONTENT,string][];await prisma.$transaction(entries.map(([key,value])=>prisma.siteSetting.upsert({where:{key},update:{value:{text:value} as Prisma.InputJsonValue},create:{key,value:{text:value} as Prisma.InputJsonValue}})));return NextResponse.json({ok:true,content:parsed.data,mode:'database'});}catch{return NextResponse.json({error:'İçerik kaydedilemedi. PostgreSQL bağlantısını ve migrasyonları kontrol edin.'},{status:503});}}
