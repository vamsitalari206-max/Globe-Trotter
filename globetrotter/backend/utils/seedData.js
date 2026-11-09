export const sampleDestinations = [
  {
    title: 'Santorini Sunset Haven',
    name: 'Santorini',
    country: 'Greece',
    city: 'Oia',
    category: 'Romantic Destinations',
    description:
      'Perched on volcanic cliffs soaring above the cobalt Aegean Sea, Santorini is a dreamscape of whitewashed cubic houses, vibrant cobalt-blue domed churches, and world-renowned sunsets over the caldera. Discover volcanic black-sand beaches, prehistoric Akrotiri ruins, and Michelin-worthy cliffside gastronomy paired with crisp Assyrtiko wines.',
    shortDescription:
      'Sun-drenched Aegean paradise featuring cliffside whitewashed architecture and celestial sunset panoramas.',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewsCount: 148,
    estimatedBudget: { min: 2200, max: 6500, currency: 'USD' },
    bestTimeToVisit: 'May to October',
    attractions: [
      {
        name: 'Oia Castle Ruins & Caldera Lookout',
        description: 'Prime vantage point for the most iconic Mediterranean sunset.',
        coordinates: { lat: 36.4618, lng: 25.3753 },
      },
      {
        name: 'Red Beach (Kokkini Paralia)',
        description: 'Dramatic volcanic red-sand cove with turquoise waters.',
        coordinates: { lat: 36.3489, lng: 25.3931 },
      },
      {
        name: 'Ancient Akrotiri Archaeological Site',
        description: 'Preserved Minoan Bronze Age settlement dubbed the Minoan Pompeii.',
        coordinates: { lat: 36.3512, lng: 25.4034 },
      },
    ],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    travelTips: [
      'Pre-book cliffside restaurants at least 3 weeks in advance for prime sunset views.',
      'Wear sturdy walking shoes for cobblestones and steep cliff staircases.',
      'Take a private catamaran cruise to explore hot springs and hidden calderas.',
    ],
    isFeatured: true,
  },
  {
    title: 'Kyoto Imperial Serenity',
    name: 'Kyoto',
    country: 'Japan',
    city: 'Kyoto',
    category: 'Temples',
    description:
      'Kyoto was the imperial capital of Japan for over a millennium. Renowned for thousands of classical Buddhist temples, Zen rock gardens, imperial palaces, and traditional wooden machiya townhouses. In the historic Gion district, geisha culture endures, while serene bamboo groves in Arashiyama invite quiet contemplation.',
    shortDescription:
      'Timeless sanctuary of bamboo groves, golden shrines, traditional tea ceremonies, and Zen gardens.',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    reviewsCount: 215,
    estimatedBudget: { min: 1800, max: 4800, currency: 'USD' },
    bestTimeToVisit: 'March to May & October to November',
    attractions: [
      {
        name: 'Fushimi Inari Taisha',
        description: 'Thousand vermilion torii gates winding through tranquil mountain woodland.',
        coordinates: { lat: 34.9671, lng: 135.7727 },
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion)',
        description: 'Zen temple whose top two floors are completely covered in gold leaf.',
        coordinates: { lat: 35.0394, lng: 135.7292 },
      },
      {
        name: 'Arashiyama Bamboo Grove',
        description: 'Soaring green bamboo stalks rustling under gentle mountain breezes.',
        coordinates: { lat: 35.0168, lng: 135.6713 },
      },
    ],
    coordinates: { lat: 35.0116, lng: 135.7681 },
    travelTips: [
      'Visit Fushimi Inari at sunrise (6 AM) to experience ethereal solitude without crowds.',
      'Purchase an IC card (Suica/Pasmo) for seamless bus and train navigation across the city.',
      'Reserve a traditional Kaiseki multicourse dinner at least one month early.',
    ],
    isFeatured: true,
  },
  {
    title: 'Swiss Alpine Majesty - Zermatt & Matterhorn',
    name: 'Zermatt',
    country: 'Switzerland',
    city: 'Valais',
    category: 'Mountains',
    description:
      'Nestled beneath the majestic, pyramid-shaped Matterhorn peak, Zermatt is a world-class car-free alpine resort renowned for luxury chalets, mountaineering, year-round glacier skiing, and scenic cogwheel railways traversing breathtaking peaks and crystalline glacial lakes.',
    shortDescription:
      'Pristine alpine wonder crowned by the iconic Matterhorn, offering pure mountain luxury.',
    images: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    rating: 4.88,
    reviewsCount: 132,
    estimatedBudget: { min: 3200, max: 8500, currency: 'USD' },
    bestTimeToVisit: 'June to September & December to April',
    attractions: [
      {
        name: 'Matterhorn Glacier Paradise',
        description: 'Highest cable car station in Europe offering 360-degree views of 38 alpine peaks.',
        coordinates: { lat: 45.9383, lng: 7.7297 },
      },
      {
        name: 'Gornergrat Cogwheel Railway',
        description: 'Scenic railway ascending to 3,089 meters overlooking the Gorner Glacier.',
        coordinates: { lat: 45.9839, lng: 7.7831 },
      },
    ],
    coordinates: { lat: 45.9765, lng: 7.7491 },
    travelTips: [
      'Zermatt is strictly car-free; park at Tasch and take the swift shuttle train into town.',
      'Invest in a Swiss Travel Pass for limitless train, boat, and cableway privileges.',
    ],
    isFeatured: true,
  },
  {
    title: 'Mystical Ladakh - Land of High Passes',
    name: 'Ladakh',
    country: 'India',
    city: 'Leh',
    category: 'Adventure',
    description:
      'Situated in the rain shadow of the mighty Himalayas, Ladakh is a high-altitude desert realm of dramatic moonscapes, snow-dusted ridges, turquoise glacial lakes, and centuries-old Tibetan Buddhist monasteries echoing with ancient mantras.',
    shortDescription:
      'Rugged Himalayan plateau with surreal moonscapes, monasteries, and sapphire lakes.',
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    rating: 4.92,
    reviewsCount: 176,
    estimatedBudget: { min: 900, max: 2800, currency: 'USD' },
    bestTimeToVisit: 'May to September',
    attractions: [
      {
        name: 'Pangong Tso Lake',
        description: 'Endorheic salt lake changing shades from deep azure to emerald green.',
        coordinates: { lat: 33.7595, lng: 78.6674 },
      },
      {
        name: 'Thiksey Monastery',
        description: 'Imposing 12-storey monastery complex resembling the Potala Palace of Lhasa.',
        coordinates: { lat: 34.0583, lng: 77.6667 },
      },
      {
        name: 'Khardung La Pass',
        description: 'One of the highest motorable mountain passes in the world at 17,982 feet.',
        coordinates: { lat: 34.2787, lng: 77.6047 },
      },
    ],
    coordinates: { lat: 34.1526, lng: 77.5771 },
    travelTips: [
      'Strictly rest for the first 24 to 48 hours upon landing in Leh to acclimatize to high altitude.',
      'Carry adequate cash; electronic POS terminals and ATMs are sparse in remote valleys.',
      'Obtain Inner Line Permits in advance for Nubra Valley and Pangong Lake.',
    ],
    isFeatured: true,
  },
  {
    title: 'Sacred Varanasi - The Eternal City of Light',
    name: 'Varanasi',
    country: 'India',
    city: 'Varanasi',
    category: 'Historical Places',
    description:
      'Believed to be one of the oldest continuously inhabited cities on Earth, Varanasi stands along the sacred banks of the Ganges River. With its labyrinth of ancient alleys, sacred ghats glowing under evening aarti ceremonies, and profound spiritual energy, it offers an unforgettable glimpse into India’s soul.',
    shortDescription:
      'Spiritual heart of India along the sacred Ganges with timeless rituals and evening Ganga Aarti.',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    rating: 4.85,
    reviewsCount: 142,
    estimatedBudget: { min: 600, max: 2100, currency: 'USD' },
    bestTimeToVisit: 'October to March',
    attractions: [
      {
        name: 'Dashashwamedh Ghat & Evening Maha Aarti',
        description: 'Spectacular choreographed ritual of brass lamps and devotional hymns.',
        coordinates: { lat: 25.3069, lng: 83.0104 },
      },
      {
        name: 'Kashi Vishwanath Temple',
        description: 'Revered golden spire temple dedicated to Lord Shiva.',
        coordinates: { lat: 25.3109, lng: 83.0107 },
      },
      {
        name: 'Sarnath Deer Park',
        description: 'Historical site where Gautama Buddha taught his first sermon.',
        coordinates: { lat: 25.3811, lng: 83.0214 },
      },
    ],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    travelTips: [
      'Take a private wooden boat ride at dawn to watch sunrise bathe the centuries-old ghats.',
      'Savor authentic Banarasi paan, creamy malaiyyo, and piping hot kachoris.',
    ],
    isFeatured: false,
  },
  {
    title: 'Amalfi Coast - The Cliffside Jewel of Italy',
    name: 'Amalfi Coast',
    country: 'Italy',
    city: 'Positano',
    category: 'Romantic Destinations',
    description:
      'A masterpiece of vertical Mediterranean charm, Italy’s Amalfi Coast features pastel-tinted villas clinging to sheer limestone cliffs, fragrant lemon groves, azure coves, and cliffside trattorias overlooking the sparkling Gulf of Salerno.',
    shortDescription:
      'Pastel villas cascading down dramatic cliffs above the sapphire Mediterranean waters.',
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    rating: 4.91,
    reviewsCount: 165,
    estimatedBudget: { min: 2800, max: 7500, currency: 'USD' },
    bestTimeToVisit: 'April to June & September to October',
    attractions: [
      {
        name: 'Positano Marina Grande',
        description: 'Vibrant pebble beach lined with stylish beach clubs and seafood bistros.',
        coordinates: { lat: 40.6281, lng: 14.485 },
      },
      {
        name: 'Path of the Gods (Sentiero degli Dei)',
        description: 'High clifftop trail revealing panoramic views of Capri and the coastline.',
        coordinates: { lat: 40.6193, lng: 14.512 },
      },
    ],
    coordinates: { lat: 40.634, lng: 14.6027 },
    travelTips: [
      'Opt for ferry travel between towns instead of buses to dodge coastal traffic jams.',
      'Wear flat-soled espadrilles; you will conquer hundreds of stone steps daily.',
    ],
    isFeatured: true,
  },
  {
    title: 'Bali Island of the Gods',
    name: 'Bali',
    country: 'Indonesia',
    city: 'Ubud & Seminyak',
    category: 'Beaches',
    description:
      'Indonesia’s crown jewel merges emerald cascading rice terraces, sacred volcanic water temples, world-class beach clubs, and serene holistic yoga sanctuaries. From the cultural heart of Ubud to the glamorous sunset bars of Uluwatu.',
    shortDescription:
      'Tropical bliss combining emerald rice terraces, spiritual water temples, and beachside luxury.',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    rating: 4.87,
    reviewsCount: 220,
    estimatedBudget: { min: 1100, max: 3600, currency: 'USD' },
    bestTimeToVisit: 'April to October',
    attractions: [
      {
        name: 'Tegallalang Rice Terraces',
        description: 'Spectacular UNESCO-recognized subak irrigation terraced landscape.',
        coordinates: { lat: -8.4328, lng: 115.2789 },
      },
      {
        name: 'Uluwatu Clifftop Temple',
        description: 'Ancient sea temple perched on a 70m high limestone cliff with Kecak Fire dance.',
        coordinates: { lat: -8.8291, lng: 115.0849 },
      },
    ],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    travelTips: [
      'Hire a verified private driver for day excursions across Ubud and northern waterfalls.',
      'Respect temple etiquette by donning a sarong and sash at sacred shrines.',
    ],
    isFeatured: true,
  },
  {
    title: 'Serengeti Wildlife Frontier',
    name: 'Serengeti',
    country: 'Tanzania',
    city: 'Arusha',
    category: 'Wildlife',
    description:
      'The vast golden plains of the Serengeti host the greatest wildlife spectacle on the planet: the Great Migration of over two million wildebeest, zebras, and gazelles. Embark on luxury tented safaris and witness prides of lions, leopards, and cheetahs under starlit African skies.',
    shortDescription:
      'World-famous African wilderness hosting the Great Migration and five-star bush luxury.',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    rating: 4.96,
    reviewsCount: 89,
    estimatedBudget: { min: 3800, max: 9500, currency: 'USD' },
    bestTimeToVisit: 'June to October & January to March',
    attractions: [
      {
        name: 'Mara River Crossing Site',
        description: 'Dramatic wildlife crossing point filled with riverbanks and Nile crocodiles.',
        coordinates: { lat: -1.6322, lng: 34.9213 },
      },
      {
        name: 'Seronera Valley',
        description: 'Heart of the park famed for dense populations of leopards and big cats.',
        coordinates: { lat: -2.3333, lng: 34.8333 },
      },
    ],
    coordinates: { lat: -2.3333, lng: 34.8333 },
    travelTips: [
      'Book morning hot air balloon safaris well in advance for surreal aerial champagne sunrises.',
      'Pack neutral earth-toned attire and binoculars with high optical zoom.',
    ],
    isFeatured: false,
  },
  {
    title: 'Paris - The City of Grandeur & Art',
    name: 'Paris',
    country: 'France',
    city: 'Paris',
    category: 'Cities',
    description:
      'Paris is the global epicenter of art, fashion, gastronomy, and architectural romance. Stroll along the Seine, marvel at the Louvre, wander the bohemian alleys of Montmartre, and dine at world-renowned Michelin-starred restaurants.',
    shortDescription:
      'The timeless cultural capital of haute couture, classical museums, and haute cuisine.',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    rating: 4.86,
    reviewsCount: 310,
    estimatedBudget: { min: 2100, max: 6200, currency: 'USD' },
    bestTimeToVisit: 'April to June & September to November',
    attractions: [
      {
        name: 'Eiffel Tower & Champ de Mars',
        description: '330m iron lattice masterpiece towering over the Parisian landscape.',
        coordinates: { lat: 48.8584, lng: 2.2945 },
      },
      {
        name: 'Musée du Louvre',
        description: 'The world’s largest art museum holding the Mona Lisa and Winged Victory.',
        coordinates: { lat: 48.8606, lng: 2.3376 },
      },
    ],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    travelTips: [
      'Reserve timed-entry tickets online for the Louvre and Eiffel Tower weeks in advance.',
      'Experience the city via the Paris Metro; it reaches every quarter swiftly.',
    ],
    isFeatured: false,
  },
  {
    title: 'Queenstown - Adventure Capital of the Southern Alps',
    name: 'Queenstown',
    country: 'New Zealand',
    city: 'Otago',
    category: 'Adventure',
    description:
      'Framed by the dramatic Remarkables mountain range and crystal-clear Lake Wakatipu, Queenstown is the world capital of adrenaline adventures, skydiving, bungy jumping, jet-boating, and premier Pinot Noir vineyards.',
    shortDescription:
      'Thrilling alpine playground offering world-famous adrenaline sports and breathtaking landscapes.',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    rating: 4.93,
    reviewsCount: 118,
    estimatedBudget: { min: 2500, max: 6800, currency: 'USD' },
    bestTimeToVisit: 'December to February & June to August',
    attractions: [
      {
        name: 'Milford Sound Day Cruise',
        description: 'Fjord of towering cliffs, roaring waterfalls, and marine wildlife.',
        coordinates: { lat: -44.6716, lng: 167.9262 },
      },
      {
        name: 'Skyline Gondola & Luge',
        description: 'Panoramic gondola climbing Bob’s Peak with exhilarating luge tracks.',
        coordinates: { lat: -45.0298, lng: 168.6543 },
      },
    ],
    coordinates: { lat: -45.0312, lng: 168.6626 },
    travelTips: [
      'Take a day trip to Milford Sound via scenic glass-roof coach or scenic flight.',
      'Try the legendary Fergburger early in the afternoon to avoid peak lines.',
    ],
    isFeatured: false,
  },
];
