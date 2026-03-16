import { prisma } from './prisma';

export async function getDefaultLanguageCode() {
  const lang = await prisma.language.findFirst({ where: { isDefault: true } });
  return lang?.code ?? 'tr';
}

export async function getLanguages() {
  return prisma.language.findMany({ orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
}
