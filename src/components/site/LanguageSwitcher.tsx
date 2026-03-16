import Link from 'next/link';
import { getLanguages } from '@/lib/i18n';

export async function LanguageSwitcher({ current }: { current: string }) {
  const languages = await getLanguages();
  return (
    <div className="lang-switch">
      {languages.map((lang) => (
        <Link key={lang.code} href={`/${lang.code}`} className={`lang-pill ${lang.code === current ? 'active' : ''}`}>
          {lang.name}
        </Link>
      ))}
    </div>
  );
}
