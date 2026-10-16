# Rota Travel — Next.js OTA starter

Setur benzeri bilgi mimarisi ve seyahat planlama akışlarından ilham alan, özgün markalı online travel agency (OTA) proje başlangıcıdır. Setur'un logosu, metinleri veya özel tasarım varlıkları kullanılmamıştır.

## Kapsam

- Next.js App Router + React + TypeScript
- Responsive müşteri sitesi: ana sayfa, otel kataloğu, otel detayları, tur kataloğu, tur detayları, kampanyalar, gemi, tekne, uçuş yer tutucusu
- Admin dashboard, otel/tur/kampanya CRUD ekranları, PostgreSQL müşteri/rezervasyon listeleri, ana sayfa CMS metinleri ve sistem ayarlarının kalıcı yönetimi
- PostgreSQL + Prisma şeması ve demo seed script'i
- Yönetici girişi: imzalı JWT oturumu, HTTP-only / SameSite cookie, middleware koruması
- Otel, tur, kampanya API'lerinde Zod doğrulaması; örnek katalog modu (DB bağlanmamışken sadece gösterim)

## Gereksinimler

- Node.js 20.10+
- PostgreSQL 14+
- npm

## Yerel kurulum

```bash
cp .env.example .env
```

`.env` içinde `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` değerlerini ayarlayın. `ADMIN_SESSION_SECRET` en az 32 karakter olmalıdır.

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Tarayıcı:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Login bilgileri `.env` içindeki `ADMIN_USERNAME` / `ADMIN_PASSWORD` değerleridir. Gerçek sunucuya deploy etmeden önce örnek değerleri mutlaka değiştirin.

## Veritabanı ve API

Prisma şeması `prisma/schema.prisma` içindedir. Temel modeller: `Hotel`, `Tour`, `Campaign`, `Customer`, `Booking`, `SiteSetting`, `AdminUser`.

- `GET/POST /api/hotels`
- `PATCH/DELETE /api/hotels/:id`
- `GET/POST /api/tours`
- `PATCH/DELETE /api/tours/:id`
- `GET/POST /api/campaigns`
- `PATCH/DELETE /api/campaigns/:id`
- `GET /api/bookings`, `GET /api/customers`
- `GET/PUT /api/admin/content`, `GET/PUT /api/admin/settings` (oturum gerektirir)
- `GET /api/site-content`, `GET /api/site-settings` (müşteri sitesinin public metinleri için)
- `POST /api/admin/login`, `POST /api/admin/logout`

Admin API uçları ve `/admin/*` yolları oturum cookie'siyle korunur. DB bağlı değilken GET katalog uçları örnek veri döndürebilir; POST/PATCH/DELETE gerçek PostgreSQL bağlantısı olmadan kalıcı yazma yapmaz.

## Gerçek OTA için tamamlanması gerekenler

Bu repo, çalıştırılabilir bir başlangıç ve görsel prototip olarak düşünülmelidir; doğrudan üretime hazır bir satış altyapısı değildir. Canlıya geçişten önce:

1. Otel, uçak, gemi ve tur tedarikçi API'leri / GDS bağlantısı eklenmeli; fiyat ve müsaitlik her rezervasyonda tedarikçiden doğrulanmalı.
2. Ödeme sağlayıcısı, 3-D Secure, webhook doğrulama, iade/iptal mutabakatı ve idempotency uygulanmalı. Kart verisi doğrudan bu uygulamada saklanmamalı.
3. Kullanıcı üyeliği, müşteri oturumu, e-posta doğrulama ve parola sıfırlama akışları eklenmeli.
4. Üretim seviyesinde RBAC izinlerinin veritabanında yönetilmesi, audit trail, hız sınırlama, CSRF/origin kontrolleri, güvenlik başlıkları ve izleme tamamlanmalı.
5. CMS metinleri ve işletme ayarları `SiteSetting` tablosuna yazılır; medya yükleme, gelişmiş sayfa blokları ve rol bazlı alan yetkileri henüz eklenmemiştir.
6. Müşteri sayfası, yasal metinler ve çerez yönetimi işletmenin gerçek verileri ve hukuk/uyum gereksinimleriyle tamamlanmalı.
7. Otel / tur arama parametreleri, ileri tarih/oda/çocuk yaşları, vergi/fiyat kırılımları, kuponlar, stok tutma süresi ve rezervasyon durum geçişleri iş kurallarına göre test edilmeli.

## Tasarım notları

Arayüz Türkçe, responsive ve Rota markasıyla hazırlanmıştır. Uzaktan yüklenen demo görselleri kullanılır; üretimde lisanslı görsel içerik ve kendi medya CDN'inizi yapılandırın.
