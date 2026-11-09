import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Mountain,
  Sun,
  Flame,
  Landmark,
  Building,
  Heart,
  TreePine,
  CheckCircle2,
  ChevronRight,
  Star,
  Quote,
} from 'lucide-react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  { name: 'Romantic Destinations', icon: Heart, count: '14+ Havens', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mountains', icon: Mountain, count: '28+ Peaks', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
  { name: 'Beaches', icon: Sun, count: '35+ Coasts', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Adventure', icon: Flame, count: '22+ Trails', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Historical Places', icon: Landmark, count: '40+ Relics', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Temples', icon: Building, count: '18+ Shrines', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Wildlife', icon: TreePine, count: '12+ Reserves', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cities', icon: Building, count: '30+ Metropolises', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
];

const testimonials = [
  {
    quote: 'Globetrotter designed our honeymoon in Santorini and Kyoto down to the exact sunset hour. The AI day-wise planner was shockingly accurate with restaurant reservations and budgeting!',
    author: 'Lady Victoria & Arthur Sterling',
    role: 'Private Explorer Club, London',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    quote: 'The high-altitude Ladakh itinerary provided every essential tip on acclimatization, monastery timings, and private mountain transport. Absolutely world-class travel technology.',
    author: 'Devendra Singhania',
    role: 'Architect & Alpine Mountaineer, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    quote: 'Being able to log multi-currency travel expenses against the AI budget projection gave us total financial clarity while trekking across the Swiss Alps. Truly unmatched.',
    author: 'Camille Laurent',
    role: 'Creative Director, Paris',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
];

const Home = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/destinations/featured');
        if (data.success) {
          setFeaturedDestinations(data.destinations);
        }
      } catch (err) {
        console.warn('Could not fetch featured destinations from server, using fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop Image with Dark Luxury Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2000&q=85"
            alt="Cinematic World Travel"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080B10]/70 via-[#080B10]/60 to-[#080B10]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,180,119,0.12)_0,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-12 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-bg-card/70 backdrop-blur-md text-gold text-xs font-semibold tracking-widest uppercase shadow-gold-sm">
            <Compass className="w-4 h-4 animate-spin text-gold" style={{ animationDuration: '8s' }} />
            <span>GLOBETROTTER — Explore Beyond Boundaries</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-luxury-text leading-[1.15]">
            The World Is Waiting <br />
            <span className="text-gold-gradient font-serif italic">For You.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-luxury-muted font-normal leading-relaxed">
            Curate bespoke day-wise itineraries, explore celestial destinations with interactive cartography,
            and orchestrate your journeys powered by advanced Google Gemini intelligence.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-bg-card/90 backdrop-blur-xl border border-gold/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-gold flex-shrink-0" />
              <input
                type="text"
                placeholder="Where would your spirit wander? (e.g., Santorini, Kyoto, Swiss Alps, Ladakh)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-luxury-text placeholder-luxury-muted focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-gradient text-bg-primary font-bold text-sm tracking-wide shadow-gold-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/plan-trip"
              className="px-6 py-3.5 rounded-xl bg-gold-gradient text-bg-primary font-bold text-sm tracking-wide shadow-gold-md hover:opacity-95 transition-all flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Your Journey with AI</span>
            </Link>

            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-bg-card/80 border border-luxury-border hover:border-gold text-luxury-text font-semibold text-sm tracking-wide backdrop-blur-md transition-all flex items-center gap-2 hover:bg-bg-hover"
            >
              <span>Explore Destinations</span>
              <ChevronRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-luxury-border/60 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-1">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text">
              Featured Luxury Destinations
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-hover font-semibold transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading curated world destinations..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.slice(0, 6).map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR TRAVEL CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Bespoke Horizons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text">
            Popular Travel Categories
          </h2>
          <p className="text-sm text-luxury-muted">
            Tailor your exploration to match your unique travel philosophy and passions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-luxury-border/60 hover:border-gold/60 transition-all duration-300 hover:shadow-gold-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className="w-8 h-8 rounded-full bg-bg-primary/80 backdrop-blur-md border border-gold/40 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-luxury-text group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-gold-light font-medium">
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE GLOBETROTTER */}
      <section className="bg-bg-secondary/60 border-y border-luxury-border/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">
              The Sovereign Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text">
              Why Choose Globetrotter
            </h2>
            <p className="text-sm text-luxury-muted">
              Blending artificial intelligence precision with the elegance of bespoke private concierge travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border/60 hover:border-gold/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Gemini AI Architect
              </h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Generates day-wise, morning-to-night itineraries tailored to your dates, travelers, budgets, and personal travel philosophy.
              </p>
            </div>

            <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border/60 hover:border-gold/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Hand-Curated Sanctuaries
              </h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Every destination is vetted with verified coordinates, authentic attractions, high-res photography, and insider connoisseur tips.
              </p>
            </div>

            <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border/60 hover:border-gold/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Smart Budget Ledger
              </h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Track every expense across six key travel categories with interactive Recharts visualizations and real-time variance monitoring.
              </p>
            </div>

            <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border/60 hover:border-gold/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Interactive Cartography
              </h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Explore coordinates on dynamic OpenStreetMap and Leaflet canvases styled in high-luxury dark matter cartography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI TRAVEL PLANNER PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-gold/40 bg-gradient-to-r from-bg-card via-bg-secondary to-bg-card p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Travel AI</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text leading-tight">
              Design Your Perfect Voyage in <span className="text-gold-gradient italic">Seconds.</span>
            </h2>

            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
              Tell our AI where you wish to go, your travel companions, dates, and budget. Globetrotter synthesizes a complete structured master itinerary with morning, afternoon, and evening excursions, budget estimates, and insider etiquette.
            </p>

            <div className="pt-2">
              <Link
                to="/plan-trip"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gold-gradient text-bg-primary font-bold text-sm tracking-wide shadow-gold-md hover:opacity-95 transition-all"
              >
                <span>Launch AI Travel Planner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative ambient gold glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_right,rgba(214,180,119,0.15)_0,transparent_70%)] pointer-events-none" />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-text">
            Endorsed by World Explorers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-bg-card p-6 rounded-2xl border border-luxury-border/60 flex flex-col justify-between space-y-6 hover:border-gold/40 transition-all"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-gold/40" />
                <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-luxury-border/40 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-gold/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-luxury-text">{t.author}</h4>
                  <p className="text-[11px] text-gold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
