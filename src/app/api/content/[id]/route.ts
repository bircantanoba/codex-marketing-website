import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const updated = await prisma.content.update({
    where: { id: params.id },
    data: {
      category: body.category ?? null,
      imageUrl: body.imageUrl ?? null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
    }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.content.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
