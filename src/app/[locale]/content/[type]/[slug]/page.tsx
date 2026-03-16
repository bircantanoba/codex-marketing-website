import { notFound } from 'next/navigation';
import { ContentType } from '@prisma/client';
import { getContentBySlug } from '@/lib/site';

const mapper: Record<string, ContentType> = {
  product: ContentType.PRODUCT,
  article: ContentType.ARTICLE,
  blog: ContentType.BLOG
};

export default async function ContentDetailPage({ params }: { params: { locale: string; type: string; slug: string } }) {
  const type = mapper[params.type];
  if (!type) return notFound();

  const content = await getContentBySlug(type, params.locale, params.slug);
  if (!content) return notFound();

  return (
    <main className="container" style={{ paddingTop: '2rem' }}>
      <article className="card">
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className="rich-preview" dangerouslySetInnerHTML={{ __html: content.bodyHtml }} />
      </article>
    </main>
  );
}
