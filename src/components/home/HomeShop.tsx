'use client';

import Link from 'next/link';

interface ShopItem {
  slug: string;
  name: string;
  price: string;
  stars: string;
  tag: string;
  href: string;
}

const ITEMS: ShopItem[] = [
  { slug: 'scope-bresser-76-300', name: 'Bresser Junior 76/300', price: '199 GEL · ~$72', stars: '500 Stars', tag: 'Starter telescope', href: '/marketplace' },
  { slug: 'scope-celestron-70az', name: 'Celestron AstroMaster 70', price: '549 GEL · ~$200', stars: '1,500 Stars', tag: 'Best seller', href: '/marketplace' },
  { slug: 'dig-starmap', name: 'Custom star map', price: '29 GEL · ~$10', stars: '250 Stars', tag: 'Digital download', href: '/marketplace' },
];

function StarIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 1l1.2 2.6L9 4l-2 1.9.5 2.8L5 7.4 2.5 8.7 3 5.9 1 4l2.8-.4z" fill="currentColor" />
    </svg>
  );
}

function ShopIcon({ tag }: { tag: string }) {
  if (tag === 'Digital download') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="home-shop-image-icon">
        <rect x="5" y="5" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="19" cy="11" r="1" fill="currentColor" />
        <circle cx="13" cy="17" r="1" fill="currentColor" />
        <path d="M9 9l4 8 6-6" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="home-shop-image-icon">
      <circle cx="15" cy="11" r="5" stroke="currentColor" strokeWidth="1" />
      <path d="M10 18l5 4 5-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11h6M15 7v8" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

export default function HomeShop() {
  return (
    <section className="home-section home-section-border">
      <div className="home-col-head">
        <h2 className="home-col-title">Telescope shop</h2>
        <Link href="/marketplace" className="home-col-link">Full marketplace</Link>
      </div>
      <div className="home-shop-grid">
        {ITEMS.map((item) => (
          <Link key={item.slug} href={item.href} className="home-shop-card">
            <div className="home-shop-image">
              <ShopIcon tag={item.tag} />
            </div>
            <div className="home-shop-info">
              <span className="home-shop-name">{item.name}</span>
              <span className="home-shop-price">{item.price}</span>
              <span className="home-shop-stars">
                <StarIcon /> {item.stars}
              </span>
              <span className="home-shop-tag">{item.tag}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
