import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ArrowRight, Trash2, Edit3, Compass } from 'lucide-react';

const statusColors = {
  Planned: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  Upcoming: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  Ongoing: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  Completed: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  Cancelled: 'bg-red-900/40 text-red-300 border-red-700/50',
};

const TripCard = ({ trip, onDelete, onStatusChange }) => {
  const startDateStr = new Date(trip.startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDateStr = new Date(trip.endDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const spent = trip.spentBudget || 0;
  const budget = trip.budget || 1;
  const spentPct = Math.min(100, Math.round((spent / budget) * 100));

  return (
    <div className="group bg-bg-card rounded-2xl overflow-hidden border border-luxury-border/60 hover:border-gold/50 transition-all duration-300 hover:shadow-gold-sm flex flex-col">
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden bg-bg-secondary">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border backdrop-blur-md ${
              statusColors[trip.status] || statusColors.Planned
            }`}
          >
            {trip.status}
          </span>
        </div>

        {/* AI Tag */}
        {trip.isAIGenerated && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold/90 text-bg-primary shadow-sm">
              AI Curated
            </span>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-xs uppercase tracking-wider text-gold font-semibold block">
            {trip.destination}
          </span>
          <h3 className="font-serif text-lg font-bold text-luxury-text truncate group-hover:text-gold transition-colors">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-4">
        <div className="space-y-2 text-xs text-luxury-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gold/80" />
            <span>{startDateStr} – {endDateStr}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-gold/80" />
              <span>{trip.travelers} Traveler(s)</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-bg-secondary text-gray-300 border border-luxury-border">
              {trip.travelType || 'Leisure'}
            </span>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-luxury-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-luxury-muted">Budget Spent</span>
            <span className="font-semibold text-luxury-text">
              <span className="text-gold">${spent.toLocaleString()}</span> / ${budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden border border-luxury-border/40">
            <div
              className={`h-full transition-all duration-500 ${
                spentPct > 90 ? 'bg-red-500' : spentPct > 70 ? 'bg-amber-400' : 'bg-gold'
              }`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-luxury-muted">
            <span>{spentPct}% utilized</span>
            <span>${Math.max(0, budget - spent).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-luxury-border/40 flex items-center justify-between gap-2">
          <button
            onClick={() => onDelete(trip._id)}
            className="p-2 rounded-lg text-luxury-muted hover:text-red-400 hover:bg-red-950/30 transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/trip/${trip._id}`}
            className="flex-1 py-2 px-3 rounded-lg bg-bg-secondary hover:bg-gold hover:text-bg-primary text-xs font-semibold text-luxury-text flex items-center justify-center gap-1.5 border border-luxury-border hover:border-gold transition-all duration-300"
          >
            <span>View Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
