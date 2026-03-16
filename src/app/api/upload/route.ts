import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'IMGBB_API_KEY missing' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'file missing' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');

  const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: new URLSearchParams({ image: base64 })
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    return NextResponse.json({ error: uploadData?.error?.message ?? 'imgbb upload failed' }, { status: 400 });
  }

  return NextResponse.json({ url: uploadData.data.url });
}
