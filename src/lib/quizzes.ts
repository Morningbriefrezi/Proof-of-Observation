export interface QuizQuestion {
  q: { en: string; ka: string };
  options: { en: string; ka: string }[];
  correct: number;
}

export interface QuizDef {
  id: string;
  emoji: string;
  title: { en: string; ka: string };
  description: { en: string; ka: string };
  starsPerCorrect: number;
  questions: QuizQuestion[];
}

export const QUIZZES: QuizDef[] = [
  {
    id: 'solar-system',
    emoji: '☀️',
    title: { en: 'Solar System', ka: 'მზის სისტემა' },
    description: { en: 'Test your knowledge of planets, moons, and our cosmic neighborhood.', ka: 'შეამოწმე ცოდნა პლანეტების, მთვარეების და ჩვენი კოსმოსური სამეზობლოს შესახებ.' },
    starsPerCorrect: 10,
    questions: [
      {
        q: { en: 'How many planets are in our solar system?', ka: 'რამდენი პლანეტაა ჩვენს მზის სისტემაში?' },
        options: [
          { en: '7', ka: '7' },
          { en: '8', ka: '8' },
          { en: '9', ka: '9' },
          { en: '10', ka: '10' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which is the largest planet in our solar system?', ka: 'რომელია ყველაზე დიდი პლანეტა მზის სისტემაში?' },
        options: [
          { en: 'Saturn', ka: 'სატურნი' },
          { en: 'Neptune', ka: 'ნეპტუნი' },
          { en: 'Jupiter', ka: 'იუპიტერი' },
          { en: 'Uranus', ka: 'ურანი' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Which planet is known as the Red Planet?', ka: 'რომელ პლანეტას ეძახიან წითელ პლანეტას?' },
        options: [
          { en: 'Venus', ka: 'ვენერა' },
          { en: 'Mars', ka: 'მარსი' },
          { en: 'Mercury', ka: 'მერკური' },
          { en: 'Jupiter', ka: 'იუპიტერი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which planet is closest to the Sun?', ka: 'რომელი პლანეტაა მზესთან ყველაზე ახლოს?' },
        options: [
          { en: 'Venus', ka: 'ვენერა' },
          { en: 'Earth', ka: 'დედამიწა' },
          { en: 'Mercury', ka: 'მერკური' },
          { en: 'Mars', ka: 'მარსი' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Which planet has the most visible rings?', ka: 'რომელ პლანეტას აქვს ყველაზე თვალსაჩინო რგოლები?' },
        options: [
          { en: 'Jupiter', ka: 'იუპიტერი' },
          { en: 'Uranus', ka: 'ურანი' },
          { en: 'Neptune', ka: 'ნეპტუნი' },
          { en: 'Saturn', ka: 'სატურნი' },
        ],
        correct: 3,
      },
      {
        q: { en: 'Which is the hottest planet in the solar system?', ka: 'რომელია ყველაზე ცხელი პლანეტა მზის სისტემაში?' },
        options: [
          { en: 'Mercury', ka: 'მერკური' },
          { en: 'Venus', ka: 'ვენერა' },
          { en: 'Mars', ka: 'მარსი' },
          { en: 'Jupiter', ka: 'იუპიტერი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'How long does Earth take to orbit the Sun?', ka: 'რამდენ ხანს სჭირდება დედამიწას მზის ირგვლივ ბრუნვა?' },
        options: [
          { en: '24 hours', ka: '24 საათი' },
          { en: '30 days', ka: '30 დღე' },
          { en: '365 days', ka: '365 დღე' },
          { en: '400 days', ka: '400 დღე' },
        ],
        correct: 2,
      },
      {
        q: { en: 'What are Jupiter\'s four large moons collectively called?', ka: 'რა ჰქვია იუპიტერის ოთხ დიდ მთვარეს ერთობლივად?' },
        options: [
          { en: 'The Galilean Moons', ka: 'გალილეური მთვარეები' },
          { en: 'The Jovian Moons', ka: 'იოვური მთვარეები' },
          { en: 'The Giant Moons', ka: 'გიგანტური მთვარეები' },
          { en: 'The Inner Moons', ka: 'შიდა მთვარეები' },
        ],
        correct: 0,
      },
      {
        q: { en: 'Which planet rotates on its side (extreme axial tilt ~98°)?', ka: 'რომელი პლანეტა ბრუნავს გვერდულად (~98° ღერძული დახრა)?' },
        options: [
          { en: 'Neptune', ka: 'ნეპტუნი' },
          { en: 'Saturn', ka: 'სატურნი' },
          { en: 'Uranus', ka: 'ურანი' },
          { en: 'Venus', ka: 'ვენერა' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Which is the largest moon in the solar system?', ka: 'რომელია ყველაზე დიდი მთვარე მზის სისტემაში?' },
        options: [
          { en: 'The Moon (Earth)', ka: 'მთვარე (დედამიწის)' },
          { en: 'Titan (Saturn)', ka: 'ტიტანი (სატურნის)' },
          { en: 'Ganymede (Jupiter)', ka: 'განიმედი (იუპიტერის)' },
          { en: 'Triton (Neptune)', ka: 'ტრიტონი (ნეპტუნის)' },
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 'constellations',
    emoji: '✦',
    title: { en: 'Stars & Constellations', ka: 'ვარსკვლავები და თანავარსკვლავედები' },
    description: { en: 'How well do you know the night sky, its patterns, and famous stars?', ka: 'რამდენად კარგად იცნობ ღამის ცას, მის ნახატებს და ცნობილ ვარსკვლავებს?' },
    starsPerCorrect: 10,
    questions: [
      {
        q: { en: 'How many official constellations are recognized by the IAU?', ka: 'რამდენი ოფიციალური თანავარსკვლავედია IAU-ს მიერ აღიარებული?' },
        options: [
          { en: '48', ka: '48' },
          { en: '72', ka: '72' },
          { en: '88', ka: '88' },
          { en: '100', ka: '100' },
        ],
        correct: 2,
      },
      {
        q: { en: 'What is the brightest star in the night sky?', ka: 'რომელია ყველაზე კაშკაში ვარსკვლავი ღამის ცაზე?' },
        options: [
          { en: 'Polaris', ka: 'პოლარისი' },
          { en: 'Betelgeuse', ka: 'ბეთელგეიზე' },
          { en: 'Sirius', ka: 'სირიუსი' },
          { en: 'Vega', ka: 'ვეგა' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Which constellation contains the North Star (Polaris)?', ka: 'რომელ თანავარსკვლავედშია ჩრდილოეთის ვარსკვლავი (პოლარისი)?' },
        options: [
          { en: 'Ursa Major', ka: 'დიდი დათვი' },
          { en: 'Cassiopeia', ka: 'კასიოპეა' },
          { en: 'Orion', ka: 'ორიონი' },
          { en: 'Ursa Minor', ka: 'პატარა დათვი' },
        ],
        correct: 3,
      },
      {
        q: { en: 'What is the largest constellation in the sky?', ka: 'რომელია ყველაზე დიდი თანავარსკვლავედი ცაზე?' },
        options: [
          { en: 'Orion', ka: 'ორიონი' },
          { en: 'Hydra', ka: 'ჰიდრა' },
          { en: 'Virgo', ka: 'ქალწული' },
          { en: 'Centaurus', ka: 'კენტავრი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which constellation is known as "The Hunter"?', ka: 'რომელ თანავარსკვლავედს ეძახიან "მონადირეს"?' },
        options: [
          { en: 'Perseus', ka: 'პერსევსი' },
          { en: 'Hercules', ka: 'ჰერკულესი' },
          { en: 'Orion', ka: 'ორიონი' },
          { en: 'Sagittarius', ka: 'მშვილდოსანი' },
        ],
        correct: 2,
      },
      {
        q: { en: 'What color is the star Betelgeuse in Orion?', ka: 'რა ფერის ვარსკვლავია ბეთელგეიზე ორიონში?' },
        options: [
          { en: 'Blue-white', ka: 'ლურჯ-თეთრი' },
          { en: 'Yellow', ka: 'ყვითელი' },
          { en: 'Red-orange', ka: 'წითელ-ნარინჯისფერი' },
          { en: 'White', ka: 'თეთრი' },
        ],
        correct: 2,
      },
      {
        q: { en: 'The Pleiades (Seven Sisters) belong to which constellation?', ka: 'პლეიადები (შვიდი და) რომელ თანავარსკვლავედს მიეკუთვნება?' },
        options: [
          { en: 'Gemini', ka: 'ტყუპები' },
          { en: 'Taurus', ka: 'კური' },
          { en: 'Aries', ka: 'ვერძი' },
          { en: 'Orion', ka: 'ორიონი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'What is the nearest star to our solar system?', ka: 'რომელია ყველაზე ახლო ვარსკვლავი ჩვენი მზის სისტემისთვის?' },
        options: [
          { en: 'Sirius', ka: 'სირიუსი' },
          { en: 'Vega', ka: 'ვეგა' },
          { en: 'Proxima Centauri', ka: 'პროქსიმა ცენტავრი' },
          { en: 'Barnard\'s Star', ka: 'ბარნარდის ვარსკვლავი' },
        ],
        correct: 2,
      },
      {
        q: { en: 'The Milky Way galaxy is what type of galaxy?', ka: 'ირმის ნახტომი რა ტიპის გალაქტიკაა?' },
        options: [
          { en: 'Elliptical', ka: 'ელიფსური' },
          { en: 'Irregular', ka: 'არარეგულარული' },
          { en: 'Barred spiral', ka: 'ზოლიანი სპირალური' },
          { en: 'Ring', ka: 'რგოლური' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Which constellation contains the Andromeda Galaxy (M31)?', ka: 'რომელ თანავარსკვლავედშია ანდრომედას გალაქტიკა (M31)?' },
        options: [
          { en: 'Pegasus', ka: 'პეგასი' },
          { en: 'Perseus', ka: 'პერსევსი' },
          { en: 'Cassiopeia', ka: 'კასიოპეა' },
          { en: 'Andromeda', ka: 'ანდრომედა' },
        ],
        correct: 3,
      },
    ],
  },
  {
    id: 'telescopes',
    emoji: '🔭',
    title: { en: 'Telescopes & Optics', ka: 'ტელესკოპები და ოპტიკა' },
    description: { en: 'Essential knowledge for telescope owners and serious observers.', ka: 'აუცილებელი ცოდნა ტელესკოპის მფლობელებისა და სერიოზული დამკვირვებლებისთვის.' },
    starsPerCorrect: 10,
    questions: [
      {
        q: { en: 'What does "aperture" mean for a telescope?', ka: 'რას ნიშნავს "ობიექტივი" ტელესკოპისთვის?' },
        options: [
          { en: 'The length of the tube', ka: 'მილის სიგრძე' },
          { en: 'The diameter of the main lens or mirror', ka: 'მთავარი ლინზის ან სარკის დიამეტრი' },
          { en: 'The magnification power', ka: 'გადიდების ძალა' },
          { en: 'The weight of the telescope', ka: 'ტელესკოპის წონა' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which type of telescope uses mirrors to collect light?', ka: 'რომელი ტიპის ტელესკოპი იყენებს სარკეებს სინათლის შეგროვებისთვის?' },
        options: [
          { en: 'Refractor', ka: 'რეფრაქტორი' },
          { en: 'Reflector (Newtonian)', ka: 'რეფლექტორი (ნიუტონის)' },
          { en: 'Binoculars', ka: 'ბინოკლი' },
          { en: 'Spotting scope', ka: 'საყურე სკოპი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'How is telescope magnification calculated?', ka: 'როგორ გამოითვლება ტელესკოპის გადიდება?' },
        options: [
          { en: 'Aperture ÷ Focal Length', ka: 'ობიექტივი ÷ ფოკუსური სიგრძე' },
          { en: 'Focal Length ÷ Eyepiece Focal Length', ka: 'ფოკუსური სიგრძე ÷ ოკულარის ფოკუსური სიგრძე' },
          { en: 'Aperture × Eyepiece', ka: 'ობიექტივი × ოკულარი' },
          { en: 'Tube length ÷ Aperture', ka: 'მილის სიგრძე ÷ ობიექტივი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'What does a Barlow lens do?', ka: 'რას აკეთებს ბარლოვის ლინზა?' },
        options: [
          { en: 'Reduces magnification', ka: 'ამცირებს გადიდებას' },
          { en: 'Filters light', ka: 'ფილტრავს სინათლეს' },
          { en: 'Increases magnification (typically 2× or 3×)', ka: 'ზრდის გადიდებას (ჩვეულებრივ 2× ან 3×)' },
          { en: 'Corrects color aberration', ka: 'ასწორებს ფერის აბერაციას' },
        ],
        correct: 2,
      },
      {
        q: { en: 'Who invented the reflecting telescope?', ka: 'ვინ გამოიგონა ასახვის ტელესკოპი?' },
        options: [
          { en: 'Galileo Galilei', ka: 'გალილეო გალილეი' },
          { en: 'Isaac Newton', ka: 'ისააკ ნიუტონი' },
          { en: 'Edwin Hubble', ka: 'ედვინ ჰაბლი' },
          { en: 'Johannes Kepler', ka: 'იოჰანეს კეპლერი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'What is the "focal ratio" (f/ratio) of a telescope?', ka: 'რა არის ტელესკოპის "ფოკუსური თანაფარდობა" (f/ratio)?' },
        options: [
          { en: 'Aperture divided by focal length', ka: 'ობიექტივი გაყოფილი ფოკუსური სიგრძეზე' },
          { en: 'Focal length divided by aperture', ka: 'ფოკუსური სიგრძე გაყოფილი ობიექტივზე' },
          { en: 'Magnification divided by weight', ka: 'გადიდება გაყოფილი წონაზე' },
          { en: 'Eyepiece size divided by magnification', ka: 'ოკულარის ზომა გაყოფილი გადიდებაზე' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which mount type is best for astrophotography?', ka: 'რომელი სამაგრის ტიპია საუკეთესო ასტროფოტოგრაფიისთვის?' },
        options: [
          { en: 'Alt-azimuth (Dobsonian)', ka: 'ალტ-აზიმუტური (დობსონის)' },
          { en: 'Equatorial (GoTo)', ka: 'ეკვატორიალური (GoTo)' },
          { en: 'Tabletop', ka: 'სუფრის' },
          { en: 'Fork mount', ka: 'ჩანგლის სამაგრი' },
        ],
        correct: 1,
      },
      {
        q: { en: 'What is the purpose of a finderscope?', ka: 'რა მიზანი აქვს საძიებო სკოპს?' },
        options: [
          { en: 'To increase magnification', ka: 'გადიდების გაზრდა' },
          { en: 'To locate objects before viewing at high magnification', ka: 'ობიექტების მოძებნა მაღალი გადიდებით ყურებამდე' },
          { en: 'To photograph deep sky objects', ka: 'ღრმა ცის ობიექტების ფოტოგრაფია' },
          { en: 'To filter light pollution', ka: 'სინათლის დაბინძურების ფილტრაცია' },
        ],
        correct: 1,
      },
      {
        q: { en: 'What does "dark adaptation" mean for observers?', ka: 'რას ნიშნავს "სიბნელეზე ადაპტაცია" დამკვირვებლებისთვის?' },
        options: [
          { en: 'Painting the telescope black', ka: 'ტელესკოპის შავად შეღებვა' },
          { en: 'Eyes adjusting to darkness for better night vision (takes ~20–30 min)', ka: 'თვალების სიბნელეზე მორგება ღამის ხილვისთვის (~20–30 წთ)' },
          { en: 'Using a red flashlight only', ka: 'მხოლოდ წითელი ფანარის გამოყენება' },
          { en: 'Setting up the telescope in shade', ka: 'ტელესკოპის ჩრდილში განთავსება' },
        ],
        correct: 1,
      },
      {
        q: { en: 'Which eyepiece gives higher magnification — 4mm or 25mm?', ka: 'რომელი ოკულარი იძლევა უფრო მაღალ გადიდებას — 4 მმ თუ 25 მმ?' },
        options: [
          { en: '25mm', ka: '25 მმ' },
          { en: 'Both are the same', ka: 'ორივე ერთნაირია' },
          { en: '4mm', ka: '4 მმ' },
          { en: 'Depends on the telescope', ka: 'დამოკიდებულია ტელესკოპზე' },
        ],
        correct: 2,
      },
    ],
  },
];
