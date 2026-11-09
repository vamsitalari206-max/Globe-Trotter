import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Plus,
  CalendarDays,
  Sparkles,
  Filter,
  Trash2,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const statuses = ['All', 'Planned', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const MyTrips = () => {
  const { user, showToast } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus && selectedStatus !== 'All') {
        params.status = selectedStatus;
      }
      const { data } = await api.get('/trips', { params });
      if (data.success) {
        setTrips(data.trips);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load trips.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [selectedStatus]);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip and its recorded expenses?')) {
      return;
    }

    try {
      const { data } = await api.delete(`/trips/${tripId}`);
      if (data.success) {
        setTrips(trips.filter((t) => t._id !== tripId));
        showToast('Trip deleted successfully.', 'info');
      }
    } catch (err) {
      showToast('Could not delete trip.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-luxury-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Voyage Repository</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
            My Curated Journeys
          </h1>
          <p className="text-sm text-luxury-muted mt-1">
            Manage your past expeditions, active travels, and future luxury itineraries.
          </p>
        </div>

        <Link
          to="/plan-trip"
          className="px-5 py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan New Journey</span>
        </Link>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === status
                ? 'bg-gold text-bg-primary shadow-gold-sm'
                : 'bg-bg-card border border-luxury-border text-luxury-muted hover:text-luxury-text hover:border-gold/40'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Trips Content */}
      {loading ? (
        <LoadingSpinner text="Retrieving your private travel portfolio..." />
      ) : trips.length === 0 ? (
        <div className="p-16 text-center bg-bg-card rounded-3xl border border-luxury-border/60 space-y-5">
          <FolderOpen className="w-16 h-16 text-gold/40 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-luxury-text">
            No Journeys Found
          </h3>
          <p className="text-xs text-luxury-muted max-w-md mx-auto leading-relaxed">
            {selectedStatus !== 'All'
              ? `You currently have no voyages marked as "${selectedStatus}". Try viewing all trips or orchestrate a new itinerary.`
              : 'You have not created or saved any voyages yet. Let our AI architect curate your dream itinerary now.'}
          </p>
          <Link
            to="/plan-trip"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Planner</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
