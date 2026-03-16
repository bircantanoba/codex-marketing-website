import { PrismaClient, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tr = await prisma.language.upsert({
    where: { code: 'tr' },
    update: { isDefault: true, name: 'Türkçe' },
    create: { code: 'tr', name: 'Türkçe', isDefault: true }
  });

  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: { isDefault: false, name: 'English' },
    create: { code: 'en', name: 'English', isDefault: false }
  });

  const baseSettings = [
    { key: 'hero_title', tr: 'Dijital büyüme için modern starter', en: 'A modern starter for digital growth' },
    { key: 'hero_description', tr: 'Tüm içerikleri admin panelden yönetin.', en: 'Manage all content from the admin panel.' },
    { key: 'cta_primary', tr: 'Ürünleri İncele', en: 'Explore Products' },
    { key: 'footer_text', tr: '© 2026 Örnek Şirket', en: '© 2026 Example Company' },
    { key: 'logo_url', tr: 'https://i.ibb.co/6P2Nn8G/logo-placeholder.png', en: 'https://i.ibb.co/6P2Nn8G/logo-placeholder.png' }
  ];

  for (const setting of baseSettings) {
    const siteSetting = await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key }
    });

    await prisma.siteSettingTranslation.upsert({
      where: { siteSettingId_languageId: { siteSettingId: siteSetting.id, languageId: tr.id } },
      update: { value: setting.tr },
      create: { siteSettingId: siteSetting.id, languageId: tr.id, value: setting.tr }
    });

    await prisma.siteSettingTranslation.upsert({
      where: { siteSettingId_languageId: { siteSettingId: siteSetting.id, languageId: en.id } },
      update: { value: setting.en },
      create: { siteSettingId: siteSetting.id, languageId: en.id, value: setting.en }
    });
  }

  const content = await prisma.content.create({
    data: {
      type: ContentType.PRODUCT,
      category: 'SaaS',
      imageUrl: 'https://i.ibb.co/wQwgjbn/product-cover.jpg',
      publishedAt: new Date(),
      translations: {
        create: [
          {
            languageId: tr.id,
            slug: 'akilli-analitik-platformu',
            title: 'Akıllı Analitik Platformu',
            description: 'Pazarlama kampanyalarınızı gerçek zamanlı optimize edin.',
            bodyHtml: '<p><strong>Akıllı Analitik Platformu</strong> ile veriyi aksiyona dönüştürün.</p>'
          },
          {
            languageId: en.id,
            slug: 'smart-analytics-platform',
            title: 'Smart Analytics Platform',
            description: 'Optimize your campaigns in real time.',
            bodyHtml: '<p>Turn your data into action with our <strong>Smart Analytics Platform</strong>.</p>'
          }
        ]
      }
    }
  });

  console.log('Seeded content:', content.id);
}

main().finally(async () => prisma.$disconnect());
