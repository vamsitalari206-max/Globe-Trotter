import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';

const DestinationCard = ({ destination }) => {
  const { toggleFavorite, isFavorite } = useAuth();
  const favorited = isFavorite(destination._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(destination._id);
  };

  const mainImage =
    destination.featuredImage ||
    destination.images?.[0] ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative bg-bg-card rounded-2xl overflow-hidden border border-luxury-border/60 hover:border-gold/50 transition-all duration-500 hover:shadow-gold-sm flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-secondary">
        <img
          src={mainImage}
          alt={destination.title || destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/30" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-bg-primary/80 backdrop-blur-md text-gold border border-gold/30">
            {destination.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bg-primary/70 backdrop-blur-md flex items-center justify-center border border-luxury-border/60 hover:border-gold text-luxury-text hover:text-red-400 transition-colors"
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>

        {/* Location & Title on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-gold-light text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>{destination.city ? `${destination.city}, ` : ''}{destination.country}</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-luxury-text truncate group-hover:text-gold transition-colors">
            {destination.name || destination.title}
          </h3>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed">
          {destination.shortDescription || destination.description}
        </p>

        <div className="pt-2 border-t border-luxury-border/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">Estimated Budget</span>
            <span className="text-xs font-semibold text-gold">
              ${destination.estimatedBudget?.min?.toLocaleString()} - ${destination.estimatedBudget?.max?.toLocaleString()}
            </span>
          </div>

          <RatingStars rating={destination.rating} reviewsCount={destination.reviewsCount} />
        </div>

        <Link
          to={`/destination/${destination._id}`}
          className="mt-1 w-full py-2 px-3 rounded-lg bg-bg-secondary hover:bg-gold hover:text-bg-primary text-xs font-semibold text-luxury-text flex items-center justify-center gap-1.5 border border-luxury-border hover:border-gold transition-all duration-300"
        >
          <span>Explore Destination</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
