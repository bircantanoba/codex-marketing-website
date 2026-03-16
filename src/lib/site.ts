import { ContentType } from '@prisma/client';
import { prisma } from './prisma';

export async function getSiteSettings(locale: string) {
  const settings = await prisma.siteSetting.findMany({
    include: {
      translations: {
        include: { language: true }
      }
    }
  });

  return settings.reduce<Record<string, string>>((acc, item) => {
    const current = item.translations.find((t) => t.language.code === locale) ?? item.translations[0];
    acc[item.key] = current?.value ?? '';
    return acc;
  }, {});
}

export async function getContentList(type: ContentType, locale: string) {
  const data = await prisma.content.findMany({
    where: { type },
    orderBy: { publishedAt: 'desc' },
    include: {
      translations: { include: { language: true } }
    }
  });

  return data
    .map((item) => {
      const t = item.translations.find((tr) => tr.language.code === locale) ?? item.translations[0];
      if (!t) return null;
      return {
        id: item.id,
        type: item.type,
        category: item.category,
        imageUrl: item.imageUrl,
        publishedAt: item.publishedAt,
        ...t
      };
    })
    .filter(Boolean);
}

export async function getContentBySlug(type: ContentType, locale: string, slug: string) {
  const translation = await prisma.contentTranslation.findFirst({
    where: { slug, language: { code: locale }, content: { type } },
    include: { content: true }
  });

  if (translation) return translation;

  return prisma.contentTranslation.findFirst({
    where: { slug, content: { type } },
    include: { content: true, language: true }
  });
}
