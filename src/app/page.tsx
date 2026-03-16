import { redirect } from 'next/navigation';
import { getDefaultLanguageCode } from '@/lib/i18n';

export default async function HomeRedirectPage() {
  const locale = await getDefaultLanguageCode();
  redirect(`/${locale}`);
}
