import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { getCampaigns } from '@/lib/catalog';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kampanyalar ve Seyahat Fırsatları' };
export default async function CampaignsPage(){const campaignData=await getCampaigns();return <main className="campaigns-page"><div className="container section"><div className="breadcrumbs">Ana Sayfa <span>/</span> Kampanyalar</div><div className="campaigns-title"><div className="eyebrow"><span/> KAÇIRMAMAN GEREKENLER</div><h1>Güzel planlar,<br/><em>güzel fırsatlarla.</em></h1><p>Yolculuğunu şimdi planla; seyahat etmenin en güzel halini keşfet.</p></div><div className="campaign-list">{campaignData.map((c,i)=><article key={c.id} className={`campaign-feature campaign-feature-${i+1}`}><div className="campaign-feature-image"><img src={c.image} alt={c.title}/><span>{c.discount}</span></div><div className="campaign-feature-content"><div className="eyebrow"><Sparkles size={13}/> ROTA FIRSATI</div><h2>{c.title}</h2><h3>{c.subtitle}</h3><p>{c.description}</p><Link href={i===2?'/tours':'/hotels'} className="button button-primary">Fırsatları keşfet <ArrowUpRight size={17}/></Link><small>* Koşullar ve müsaitlik ürünlere göre değişebilir.</small></div></article>)}</div></div></main>}
