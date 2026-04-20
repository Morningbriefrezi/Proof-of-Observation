'use client';

import HeroSection from '@/components/home/HeroSection';
import SkyOutlook from '@/components/home/SkyOutlook';
import HomeMissions from '@/components/home/HomeMissions';
import HomeMarkets from '@/components/home/HomeMarkets';
import HomeShop from '@/components/home/HomeShop';
import AstraSection from '@/components/home/AstraSection';

export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />

      <SkyOutlook />

      <section className="home-section home-section-border">
        <div className="home-two-col">
          <HomeMissions />
          <HomeMarkets />
        </div>
      </section>

      <HomeShop />

      <AstraSection />
    </div>
  );
}
