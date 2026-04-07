export type ProductCategory = 'telescope' | 'moonlamp' | 'projector' | 'accessory' | 'digital';

export interface Product {
  id: string;
  name: { en: string; ka: string };
  description: { en: string; ka: string };
  category: ProductCategory;
  priceGEL: number;
  image: string;
  inStock: boolean;
  featured: boolean;
  aiRecommendFor?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'scope-70az',
    name: { en: 'StarQuest 70 AZ', ka: 'StarQuest 70 AZ' },
    description: {
      en: '70mm refractor on alt-az mount. Perfect first telescope for Moon, planets, and star clusters.',
      ka: '70 მმ რეფრაქტორი alt-az სამაგრზე. იდეალური პირველი ტელესკოპი მთვარისა და პლანეტებისთვის.',
    },
    category: 'telescope',
    priceGEL: 399,
    image: '/images/products/scope-70az.jpg',
    inStock: true,
    featured: false,
    aiRecommendFor: ['moon', 'jupiter', 'saturn', 'beginner'],
  },
  {
    id: 'scope-114eq',
    name: { en: 'SkyWatcher 114 EQ', ka: 'SkyWatcher 114 EQ' },
    description: {
      en: '114mm Newtonian reflector on equatorial mount. Great for planets and deep-sky objects.',
      ka: '114 მმ ნიუტონის რეფლექტორი ეკვატორულ სამაგრზე. შესანიშნავია პლანეტებისა და ღრმა ცის ობიექტებისთვის.',
    },
    category: 'telescope',
    priceGEL: 899,
    image: '/images/products/scope-114eq.jpg',
    inStock: true,
    featured: true,
    aiRecommendFor: ['moon', 'jupiter', 'saturn', 'mars', 'nebula'],
  },
  {
    id: 'scope-8dob',
    name: { en: 'Orion 8" Dobsonian', ka: 'Orion 8" დობსონი' },
    description: {
      en: '8-inch Dobsonian reflector. Maximum light-gathering for galaxies, nebulae, and faint deep-sky targets.',
      ka: '8 დიუმიანი დობსონის რეფლექტორი. მაქსიმალური სინათლის შეგროვება გალაქტიკებისა და ნისლეულებისთვის.',
    },
    category: 'telescope',
    priceGEL: 2199,
    image: '/images/products/scope-8dob.jpg',
    inStock: true,
    featured: false,
    aiRecommendFor: ['nebula', 'galaxies', 'saturn', 'jupiter', 'advanced'],
  },
  {
    id: 'lamp-16cm',
    name: { en: 'Moon Lamp 16cm', ka: 'მთვარის ლამპა 16 სმ' },
    description: {
      en: '16cm 3D-printed lunar surface lamp with warm/cool LED modes. Perfect astronomy gift.',
      ka: '16 სმ 3D-ნაბეჭდი მთვარის ზედაპირის ლამპა თბილი/ცივი LED რეჟიმებით.',
    },
    category: 'moonlamp',
    priceGEL: 79,
    image: '/images/products/lamp-16cm.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 'lamp-24cm',
    name: { en: 'Moon Lamp 24cm', ka: 'მთვარის ლამპა 24 სმ' },
    description: {
      en: '24cm large lunar lamp with remote control, 16 color modes, and wooden stand.',
      ka: '24 სმ დიდი მთვარის ლამპა პულტით, 16 ფერის რეჟიმითა და ხის სადგამით.',
    },
    category: 'moonlamp',
    priceGEL: 149,
    image: '/images/products/lamp-24cm.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 'proj-basic',
    name: { en: 'Home Planetarium Basic', ka: 'სახლის პლანეტარიუმი Basic' },
    description: {
      en: 'Projects 8,000 stars onto your ceiling. Rotating star dome with timer.',
      ka: '8,000 ვარსკვლავს პროეცირებს ჭერზე. მბრუნავი ვარსკვლავური გუმბათი ტაიმერით.',
    },
    category: 'projector',
    priceGEL: 119,
    image: '/images/products/proj-basic.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 'proj-premium',
    name: { en: 'Home Planetarium Pro', ka: 'სახლის პლანეტარიუმი Pro' },
    description: {
      en: 'Projects Milky Way, constellations, and nebulae with Bluetooth music sync.',
      ka: 'პროეცირებს ირმის ნახტომს, თანავარსკვლავედებს და ნისლეულებს Bluetooth მუსიკის სინქრონიზაციით.',
    },
    category: 'projector',
    priceGEL: 249,
    image: '/images/products/proj-premium.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 'acc-phone',
    name: { en: 'Smartphone Telescope Adapter', ka: 'სმარტფონის ტელესკოპის ადაპტერი' },
    description: {
      en: 'Universal phone clip adapter for afocal astrophotography through any eyepiece.',
      ka: 'უნივერსალური ტელეფონის სამჭიდი ადაპტერი ნებისმიერ ოკულარზე ასტროფოტოგრაფიისთვის.',
    },
    category: 'accessory',
    priceGEL: 59,
    image: '/images/products/acc-phone.jpg',
    inStock: true,
    featured: false,
    aiRecommendFor: ['astrophotography', 'moon'],
  },
  {
    id: 'acc-eyepiece',
    name: { en: 'Premium 8mm Eyepiece', ka: 'პრემიუმ 8 მმ ოკულარი' },
    description: {
      en: '8mm wide-field eyepiece (66° AFOV). Excellent for planetary detail and tight clusters.',
      ka: '8 მმ ფართო ველის ოკულარი (66° AFOV). შესანიშნავია პლანეტების დეტალებისა და ვარსკვლავთა გროვებისთვის.',
    },
    category: 'accessory',
    priceGEL: 179,
    image: '/images/products/acc-eyepiece.jpg',
    inStock: true,
    featured: false,
    aiRecommendFor: ['jupiter', 'saturn', 'moon', 'mars'],
  },
  {
    id: 'dig-starmap',
    name: { en: 'Custom Star Map', ka: 'პერსონალური ვარსკვლავთა რუკა' },
    description: {
      en: 'High-resolution star map for any date, time, and location. Print-ready PDF.',
      ka: 'მაღალი გარჩევადობის ვარსკვლავთა რუკა ნებისმიერი თარიღისა და ადგილისთვის. ბეჭდვისთვის მზა PDF.',
    },
    category: 'digital',
    priceGEL: 29,
    image: '/images/products/dig-starmap.jpg',
    inStock: true,
    featured: true,
    aiRecommendFor: ['gift', 'birthday', 'anniversary'],
  },
  {
    id: 'dig-guide',
    name: { en: 'Georgian Night Sky Guide PDF', ka: 'ქართული ღამის ცის სახელმძღვანელო PDF' },
    description: {
      en: 'Complete observer\'s guide to the Georgian night sky: seasonal charts, object list, tips.',
      ka: 'სრული დამკვირვებლის სახელმძღვანელო ქართული ღამის ცისთვის: სეზონური რუკები, ობიექტების სია.',
    },
    category: 'digital',
    priceGEL: 24,
    image: '/images/products/dig-guide.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 'dig-ai',
    name: { en: 'ASTRA Premium (1 month)', ka: 'ASTRA Premium (1 თვე)' },
    description: {
      en: 'Unlock ASTRA\'s full capabilities: personalized observation plans, equipment advice, and more.',
      ka: 'განბლოკე ASTRA-ს სრული შესაძლებლობები: პერსონალური დაკვირვების გეგმები და მრავალი სხვა.',
    },
    category: 'digital',
    priceGEL: 49,
    image: '/images/products/dig-ai.jpg',
    inStock: true,
    featured: false,
  },
];

export function getProducts(category?: ProductCategory): Product[] {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}
