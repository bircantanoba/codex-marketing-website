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
      <nav className="site-nav">
        <div className="container nav-inner">
          <div className="logo-wrap">
            <img src={settings.logo_url} alt="logo" width={120} height={36} />
            <span className="logo-chip">Marketing Starter</span>
          </div>
          <LanguageSwitcher current={params.locale} />
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="card hero-panel">
            <span className="badge">No-Code Yönetim</span>
            <h1>{settings.hero_title}</h1>
            <p>{settings.hero_description}</p>
            <Link href={`/${params.locale}/content/product/${products[0]?.slug ?? ''}`}>
              <button>{settings.cta_primary}</button>
            </Link>
          </div>
          <div className="card hero-panel">
            <p className="muted">Canlı İçerik</p>
            <h3>Ürün, makale ve blog içerikleri admin panelden anında güncellenir.</h3>
            <p className="muted">Deploy beklemeden URL, metin ve görselleri düzenleyin.</p>
          </div>
        </section>

        <section>
          <h2 className="section-title">Ürünler</h2>
          <div className="grid grid-3">
            {products.map((item: any) => (
              <article className="card content-card" key={item.id}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className="inline-link" href={`/${params.locale}/content/product/${item.slug}`}>Detay →</Link>
              </article>
            ))}
          </div>
        </section>

        {blogs.length > 0 && (
          <section>
            <h2 className="section-title">Blog</h2>
            <div className="grid grid-3">
              {blogs.map((item: any) => (
                <article className="card content-card" key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link className="inline-link" href={`/${params.locale}/content/blog/${item.slug}`}>Oku →</Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="container footer">{settings.footer_text}</footer>
    </>
  );
}
