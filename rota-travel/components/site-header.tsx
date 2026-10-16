'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, UserRound, ChevronDown, Plane, Hotel, Compass, Ship, Sailboat, Tag } from 'lucide-react';

const nav = [
  { label: 'Oteller', href: '/hotels', icon: Hotel },
  { label: 'Turlar', href: '/tours', icon: Compass },
  { label: 'Kıbrıs', href: '/hotels?region=Kıbrıs', icon: Plane },
  { label: 'Uçak', href: '/flights', icon: Plane },
  { label: 'Gemi', href: '/cruises', icon: Ship },
  { label: 'Tekne', href: '/boats', icon: Sailboat },
  { label: 'Kampanyalar', href: '/campaigns', icon: Tag },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('Hayalindeki tatil, bir adım uzağında.');
  const [brandName, setBrandName] = useState('rota');
  useEffect(() => {
    let active = true;
    Promise.all([fetch('/api/site-content').then(r => r.json()), fetch('/api/site-settings').then(r => r.json())])
      .then(([contentData, settingsData]) => {
        if (!active) return;
        if (typeof contentData?.content?.announcementText === 'string') setAnnouncement(contentData.content.announcementText);
        if (typeof settingsData?.settings?.siteName === 'string' && settingsData.settings.siteName.trim()) setBrandName(settingsData.settings.siteName.toLocaleLowerCase('tr-TR').replace(/\s+seyahat$/i, '').trim() || 'rota');
      }).catch(() => { /* Defaults are intentional when API or database is unavailable. */ });
    return () => { active = false; };
  }, []);
  return <>
    <div className="topline"><div className="container topline-inner"><span>{announcement}</span><div className="topline-links"><a href="tel:4442822"><Phone size={13}/> 444 28 22</a><Link href="/admin/login"><UserRound size={13}/> Yönetici Girişi</Link></div></div></div>
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="brand" aria-label="Rota ana sayfa"><span className="brand-mark">r</span><span className="brand-word">{brandName}<span>.</span><small>SEYAHATİN GÜZEL HALİ</small></span></Link>
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Ana menü">{nav.map(item => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
      <div className="header-actions"><Link href="/account" className="account-link"><UserRound size={18}/><span>Hesabım</span></Link><button className="mobile-menu" aria-label="Menüyü aç" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    </div></header>
  </>;
}
