'use client';

import AdminShell from '@/components/admin-shell';
import { useEffect, useState } from 'react';
import { Save, Image as ImageIcon, Eye, ChevronDown, CheckCircle2, AlertCircle, LoaderCircle } from 'lucide-react';

type ContentFields = { announcementText: string; heroTitle: string; heroEmphasis: string; heroSubtitle: string };
const initial: ContentFields = {
  announcementText: 'Hayalindeki tatil, bir adım uzağında.',
  heroTitle: 'Bir sonraki hikâyen',
  heroEmphasis: 'nerede başlasın?',
  heroSubtitle: 'Rutinine küçük bir ara ver. Sana iyi gelecek rotayı birlikte bulalım.',
};

export default function ContentAdmin() {
  const [content, setContent] = useState<ContentFields>(initial);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'database' | 'demo'>('demo');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/content').then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'İçerik alınamadı.');
      if (active) {
        setContent({ ...initial, ...(data.content || {}) });
        setMode(data.mode === 'database' ? 'database' : 'demo');
      }
    }).catch(err => { if (active) setError(err.message || 'İçerik yüklenemedi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function update<K extends keyof ContentFields>(key: K, value: ContentFields[K]) {
    setContent(current => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true); setSaved(false); setError('');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'İçerik kaydedilemedi.');
      setContent({ ...initial, ...(data.content || content) });
      setMode(data.mode === 'database' ? 'database' : 'demo');
      setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'İçerik kaydedilemedi.'); }
    finally { setSaving(false); }
  }

  return <AdminShell><div className="admin-page">
    <div className="admin-page-heading"><div><div className="admin-eyebrow">MÜŞTERİ & İÇERİK <span>/</span> CMS</div><h1>Sayfa içerikleri</h1><p>Ana sayfa metinlerini, görselleri ve promosyon alanlarını düzenleyin.</p></div><button className="admin-primary-btn" onClick={save} disabled={saving || loading}><Save size={16}/> {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}</button></div>
    {loading && <div className="admin-alert"><LoaderCircle size={16}/> İçerik yükleniyor…</div>}
    {saved && <div className="admin-alert alert-success"><CheckCircle2 size={16}/> {mode === 'database' ? 'İçerik PostgreSQL veritabanına kaydedildi ve ana sayfada kullanılacak.' : 'İçerik yalnızca demo belleğinde değiştirilebildi. Kalıcı kayıt için PostgreSQL bağlantısını ve migrasyonları kurun.'}</div>}
    {error && <div className="admin-alert alert-error"><AlertCircle size={16}/>{error}<button onClick={() => setError('')}>Kapat</button></div>}
    <div className="content-editor-grid"><div className="admin-panel editor-panel"><div className="panel-heading"><div><h3>Ana sayfa — Hero alanı</h3><p>İlk ekranda görünen başlık ve arama alanı.</p></div><span className="content-live-pill"><i/> Yayında</span></div>
      <label className="admin-form-field"><span>Üst duyuru metni</span><input maxLength={180} value={content.announcementText} onChange={e => update('announcementText', e.target.value)}/></label>
      <label className="admin-form-field"><span>Ana başlık</span><textarea rows={2} maxLength={100} value={content.heroTitle} onChange={e => update('heroTitle', e.target.value)}/></label>
      <label className="admin-form-field"><span>Vurgulu başlık (italik)</span><input maxLength={100} value={content.heroEmphasis} onChange={e => update('heroEmphasis', e.target.value)}/></label>
      <label className="admin-form-field"><span>Alt başlık</span><textarea rows={3} maxLength={260} value={content.heroSubtitle} onChange={e => update('heroSubtitle', e.target.value)}/></label>
      <div className="admin-form-field"><span>Hero görseli</span><div className="upload-placeholder"><ImageIcon size={24}/><b>Kapak görseli</b><small>Görsel yükleme deposu bu başlangıç sürümüne bağlı değil; mevcut görsel kaynak koddan değiştiriliyor.</small><button type="button" className="admin-outline-btn" onClick={() => setError('Gerçek görsel yükleme için S3, Cloudinary veya başka bir medya deposu bağlanmalıdır.')}>Görsel yükleme hakkında</button></div></div>
      <div className="editor-actions"><button className="admin-outline-btn" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}><Eye size={15}/> Siteyi önizle</button><button className="admin-primary-btn" onClick={save} disabled={saving || loading}><Save size={15}/> Taslağı kaydet</button></div>
    </div><div className="content-side-stack"><div className="admin-panel preview-panel"><div className="panel-heading"><div><h3>Canlı önizleme</h3><p>Hero metinlerinin görünümü</p></div><span className="preview-device">Desktop <ChevronDown size={13}/></span></div><div className="preview-hero"><span>ROTA · {content.announcementText}</span><h2>{content.heroTitle} <em>{content.heroEmphasis}</em></h2><p>{content.heroSubtitle}</p><div className="preview-search"><span>⌕ Nereye gitmek istersiniz?</span><b>Ara →</b></div></div></div><div className="admin-panel publish-panel"><h3>Yayın ayarları</h3><div className="publish-row"><span>Durum</span><b className="content-live-pill"><i/> Yayında</b></div><div className="publish-row"><span>Kaydetme modu</span><b>{mode === 'database' ? 'PostgreSQL' : 'Demo'}</b></div><div className="publish-row"><span>Düzenleyen</span><b>Oturum açmış yönetici</b></div><div className="publish-row"><span>Hedef sayfa</span><b>Ana sayfa</b></div><button onClick={save} disabled={saving || loading} className="button button-primary publish-button"><Save size={15}/> Değişiklikleri yayınla</button></div></div></div>
  </div></AdminShell>;
}
