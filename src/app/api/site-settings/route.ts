import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.siteSetting.findMany({ include: { translations: true }, orderBy: { key: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const key = String(body.key);
  const languageId = String(body.languageId);
  const value = String(body.value ?? '');

  const siteSetting = await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key } });
  const translation = await prisma.siteSettingTranslation.upsert({
    where: { siteSettingId_languageId: { siteSettingId: siteSetting.id, languageId } },
    update: { value },
    create: { siteSettingId: siteSetting.id, languageId, value }
  });

  return NextResponse.json(translation);
}
