import { getTranslations } from 'next-intl/server';
import ForecastGrid from '@/components/sky/ForecastGrid';

export default async function SkyPage() {
  const t = await getTranslations('sky');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-page-enter">
      <h1 className="text-2xl font-bold text-white mb-6">{t('title')}</h1>
      <ForecastGrid />
    </div>
  );
}
