import { prisma } from './prisma';

export async function getDefaultLanguageCode() {
  if (!process.env.DATABASE_URL) {
    return 'tr';
  }

  const lang = await prisma.language.findFirst({ where: { isDefault: true } });
  return lang?.code ?? 'tr';
}

export async function getLanguages() {
  if (!process.env.DATABASE_URL) {
    return [
      {
        id: 'fallback-tr',
        code: 'tr',
        name: 'Türkçe',
        isDefault: true,
        createdAt: new Date()
      }
    ];
  }

  return prisma.language.findMany({ orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
}
