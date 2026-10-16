'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
export default function SiteChrome({children}:{children:React.ReactNode}){const path=usePathname();const isAdmin=path.startsWith('/admin');return <>{!isAdmin&&<SiteHeader/>}{children}{!isAdmin&&<SiteFooter/>}</>;}
