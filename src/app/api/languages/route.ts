import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.language.findMany({ orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.isDefault) {
    await prisma.language.updateMany({ data: { isDefault: false } });
  }

  const data = await prisma.language.create({
    data: {
      code: String(body.code).toLowerCase(),
      name: String(body.name),
      isDefault: Boolean(body.isDefault)
    }
  });

  return NextResponse.json(data, { status: 201 });
}
