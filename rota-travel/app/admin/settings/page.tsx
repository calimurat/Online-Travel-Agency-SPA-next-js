'use client';

import AdminShell from '@/components/admin-shell';
import { useEffect, useState } from 'react';
import { Save, ShieldCheck, Database, Globe, Bell, CreditCard, CheckCircle2, AlertCircle, LoaderCircle } from 'lucide-react';

type SettingsFields = { siteName: string; supportEmail: string; phone: string; currency: 'TRY' | 'EUR' | 'USD' };
const initial: SettingsFields = { siteName: 'Rota Seyahat', supportEmail: 'merhaba@rota.example', phone: '444 28 22', currency: 'TRY' };

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SettingsFields>(initial);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'database' | 'demo'>('demo');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/settings').then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ayarlar alınamadı.');
      if (active) { setSettings({ ...initial, ...(data.settings || {}) }); setMode(data.mode === 'database' ? 'database' : 'demo'); }
    }).catch(err => { if (active) setError(err.message || 'Ayarlar yüklenemedi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function update<K extends keyof SettingsFields>(key: K, value: SettingsFields[K]) {
    setSettings(current => ({ ...current, [key]: value })); setSaved(false);
  }

  async function save() {
    setSaving(true); setSaved(false); setError('');
    try {
      const response = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ayarlar kaydedilemedi.');
      setSettings({ ...initial, ...(data.settings || settings) }); setMode(data.mode === 'database' ? 'database' : 'demo'); setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Ayarlar kaydedilemedi.'); }
    finally { setSaving(false); }
  }

  return <AdminShell><div className="admin-page"><div className="admin-page-heading"><div><div className="admin-eyebrow">SİSTEM <span>/</span> KONFİGÜRASYON</div><h1>Sistem ayarları</h1><p>Mağaza bilgileri, altyapı bağlantıları ve operasyon tercihleri.</p></div><button className="admin-primary-btn" onClick={save} disabled={saving || loading}><Save size={16}/> {saving ? 'Kaydediliyor…' : 'Ayarları kaydet'}</button></div>
    {loading && <div className="admin-alert"><LoaderCircle size={16}/> Ayarlar yükleniyor…</div>}
    {saved && <div className="admin-alert alert-success"><CheckCircle2 size={16}/> {mode === 'database' ? 'Ayarlar PostgreSQL veritabanına kaydedildi.' : 'Demo ayarları güncellendi; kalıcı kayıt için PostgreSQL bağlantısı gerekir.'}</div>}
    {error && <div className="admin-alert alert-error"><AlertCircle size={16}/>{error}<button onClick={() => setError('')}>Kapat</button></div>}
    <div className="settings-layout"><aside className="settings-menu"><a className="active"><Globe size={17}/> Genel bilgiler</a><a><Database size={17}/> Veritabanı</a><a><ShieldCheck size={17}/> Güvenlik & roller</a><a><CreditCard size={17}/> Ödeme sağlayıcıları</a><a><Bell size={17}/> Bildirimler</a></aside><div className="settings-main"><section className="admin-panel settings-panel"><div className="panel-heading"><div><h3>İşletme bilgileri</h3><p>Müşteri tarafında görünen temel bilgiler.</p></div><Globe size={19}/></div><div className="settings-form-grid"><label className="admin-form-field"><span>Marka adı</span><input maxLength={100} value={settings.siteName} onChange={e => update('siteName', e.target.value)}/></label><label className="admin-form-field"><span>Destek e-posta adresi</span><input type="email" value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)}/></label><label className="admin-form-field"><span>Çağrı merkezi</span><input maxLength={40} value={settings.phone} onChange={e => update('phone', e.target.value)}/></label><label className="admin-form-field"><span>Varsayılan para birimi</span><select value={settings.currency} onChange={e => update('currency', e.target.value as SettingsFields['currency'])}><option value="TRY">TRY — Türk lirası</option><option value="EUR">EUR — Euro</option><option value="USD">USD — ABD doları</option></select></label></div><button className="admin-primary-btn" onClick={save} disabled={saving || loading}><Save size={15}/> Kaydet</button></section>
    <section className="admin-panel settings-panel"><div className="panel-heading"><div><h3>Altyapı durumu</h3><p>Üretime geçmeden önce kontrol edilmesi gereken bağlantılar.</p></div><Database size={19}/></div><div className="integration-row"><span className="integration-icon"><Database/></span><div><b>PostgreSQL</b><small>DATABASE_URL ile tanımlanır. Bağlantı testi için migrasyonları çalıştırın.</small></div><span className="integration-status is-pending"><i/> {mode === 'database' ? 'Kayıt bağlantısı var' : 'Demo modu'}</span></div><div className="integration-row"><span className="integration-icon"><CreditCard/></span><div><b>Ödeme sağlayıcısı</b><small>Ödeme anahtarı tanımlanmamış; canlı tahsilat kapalı.</small></div><span className="integration-status is-pending"><i/> Bağlanmadı</span></div><div className="integration-row"><span className="integration-icon"><Globe/></span><div><b>Otel / tur tedarikçisi</b><small>Gerçek fiyat, müsaitlik ve rezervasyon verisi alınmıyor.</small></div><span className="integration-status is-pending"><i/> Bağlanmadı</span></div><div className="integration-row"><span className="integration-icon"><ShieldCheck/></span><div><b>Yönetici oturumu</b><small>HTTP-only çerez ve imzalı oturum token'ı kullanılır.</small></div><span className="integration-status is-ready"><i/> Yapılandırılabilir</span></div></section><div className="admin-note"><AlertCircle size={16}/><span>Canlı ortama almadan önce varsayılan .env değerlerini değiştirin, HTTPS kullanın, yedekleme ve izleme yapılandırın, ayrıca KVKK ve ödeme gerekliliklerini hukuk/uyum danışmanıyla doğrulayın.</span></div></div></div></div></AdminShell>;
}
