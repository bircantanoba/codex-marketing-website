import Link from 'next/link';
import { ContentType } from '@prisma/client';
import { getContentList, getSiteSettings } from '@/lib/site';
import { LanguageSwitcher } from '@/components/site/LanguageSwitcher';

export default async function LocaleHomePage({ params }: { params: { locale: string } }) {
  const settings = await getSiteSettings(params.locale);
  const products = await getContentList(ContentType.PRODUCT, params.locale);
  const blogs = await getContentList(ContentType.BLOG, params.locale);

  return (
    <>
      <nav>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src={settings.logo_url} alt="logo" width={120} height={36} />
          <LanguageSwitcher current={params.locale} />
        </div>
      </nav>
      <main className="container" style={{ paddingTop: '2rem' }}>
        <section className="card" style={{ marginBottom: '1rem' }}>
          <h1>{settings.hero_title}</h1>
          <p>{settings.hero_description}</p>
          <Link href={`/${params.locale}/content/product/${products[0]?.slug ?? ''}`}>
            <button>{settings.cta_primary}</button>
          </Link>
        </section>

        <section>
          <h2>Ürünler</h2>
          <div className="grid grid-3">
            {products.map((item: any) => (
              <article className="card" key={item.id}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} width="100%" height={180} style={{ objectFit: 'cover' }} />}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={`/${params.locale}/content/product/${item.slug}`}>Detay</Link>
              </article>
            ))}
          </div>
        </section>

        {blogs.length > 0 && (
          <section>
            <h2>Blog</h2>
            <div className="grid grid-3">
              {blogs.map((item: any) => (
                <article className="card" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link href={`/${params.locale}/content/blog/${item.slug}`}>Oku</Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="container" style={{ padding: '2rem 1rem', color: '#64748b' }}>{settings.footer_text}</footer>
    </>
  );
}
