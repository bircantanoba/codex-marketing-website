import Link from 'next/link';
import { getLanguages } from '@/lib/i18n';

export async function LanguageSwitcher({ current }: { current: string }) {
  const languages = await getLanguages();
  return (
    <div style={{ display: 'flex', gap: '.5rem' }}>
      {languages.map((lang) => (
        <Link key={lang.code} href={`/${lang.code}`} style={{ fontWeight: lang.code === current ? 700 : 400 }}>
          {lang.name}
        </Link>
      ))}
    </div>
  );
}
