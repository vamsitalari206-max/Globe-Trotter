import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, MapPin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center bg-bg-card mx-auto shadow-gold-sm">
          <Compass className="w-8 h-8 text-gold animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            Error 404 • Coordinate Lost
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-text">
            Destination Beyond Radar
          </h1>
          <p className="text-sm text-luxury-muted leading-relaxed">
            The latitude and longitude you seek do not correspond to any chartered sanctuary in the Globetrotter atlas.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gold-gradient text-bg-primary font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl bg-bg-card border border-luxury-border hover:border-gold text-xs font-semibold text-luxury-text transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-gold" />
            <span>Explore Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
