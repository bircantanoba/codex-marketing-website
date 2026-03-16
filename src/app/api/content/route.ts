import { NextRequest, NextResponse } from 'next/server';
import { ContentType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as ContentType | null;

  const data = await prisma.content.findMany({
    where: type ? { type } : undefined,
    orderBy: { updatedAt: 'desc' },
    include: { translations: { include: { language: true } } }
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = await prisma.content.create({
    data: {
      type: body.type as ContentType,
      category: body.category || null,
      imageUrl: body.imageUrl || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      translations: {
        create: (body.translations || []).map((t: any) => ({
          languageId: t.languageId,
          slug: t.slug,
          title: t.title,
          description: t.description,
          bodyHtml: t.bodyHtml || '<p></p>'
        }))
      }
    },
    include: { translations: true }
  });

  return NextResponse.json(created, { status: 201 });
}
