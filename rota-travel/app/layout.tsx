import type { Metadata } from 'next';
import './globals.css';
import SiteChrome from '@/components/site-chrome';
export const metadata: Metadata = { title: { default: 'Rota | Seyahatin güzel hali', template: '%s | Rota' }, description: 'Otel, tur ve seyahat fırsatlarını keşfedin. Hayalinizdeki yolculuk Rota ile başlasın.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="tr"><body><SiteChrome>{children}</SiteChrome></body></html>; }
