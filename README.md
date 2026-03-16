# Next.js Marketing Starter (Vercel + Neon + Prisma)

Bu proje, **Next.js App Router + TypeScript** ile hazırlanmış bir marketing website starter template'idir.

## Özellikler
- `/admin` altında modern içerik yönetim paneli
- Ürün / Makale / Blog CRUD API route'ları
- Çok dilli içerik (varsayılan dil: `tr`)
- Admin panelden yeni dil ekleme
- Site metinlerini (hero, CTA, footer, logo URL vb.) panelden yönetme
- Zengin metin editörü (`react-quill-new`) ile HTML içerik düzenleme
- Görsel yükleme (`imgbb`) ve URL olarak saklama
- Prisma ORM + Neon PostgreSQL uyumu
- Dynamic routing ile deploy gerektirmeyen URL güncellemeleri
- Build sürecinde Prisma Client güncelliği için `build` komutu `prisma generate && next build` olarak ayarlanmıştır.

## Kurulum
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Gerekli ENV
`.env` dosyasına aşağıdakileri ekleyin:
```env
DATABASE_URL="postgresql://..."
IMGBB_API_KEY="..."
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

## Vercel Deploy
1. Repo'yu Vercel'e bağlayın.
2. Vercel dashboard üzerinde ENV değişkenlerini girin.
3. Build Command: `npm run build` (repo içinde `vercel.json` ile `npm run vercel-build` kullanacak şekilde override edilmiştir)
4. Start Command: `npm run start`
5. Neon veritabanı ile bağlantıyı `DATABASE_URL` üzerinden sağlayın.

## Admin Kullanımı
- `/admin` -> yeni dil ekleme, site metinlerini düzenleme
- İçerik eklerken her dil için ayrı slug/title/body tanımlayın
- Görseli dosya yükleyerek imgbb üzerinden alın
- İçerikler frontend'de anında görünür (deploy gerekmez)


## Vercel Build Akışı
- `vercel.json` -> `npm run vercel-build`
- `vercel-build` sırası: `prisma generate` -> `prisma migrate deploy` -> `prisma db seed` -> `next build`
