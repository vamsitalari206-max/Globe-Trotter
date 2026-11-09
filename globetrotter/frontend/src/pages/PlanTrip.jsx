import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  BookmarkCheck,
  RefreshCw,
  Edit2,
  Save,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const preferenceOptions = [
  'Adventure',
  'Nature',
  'History',
  'Food',
  'Shopping',
  'Relaxation',
  'Spirituality',
  'Photography',
];

const travelTypes = ['Solo', 'Couple', 'Family', 'Friends', 'Luxury Connoisseur'];
const accommodationOptions = [
  '5-Star Luxury Resort',
  'Luxury Boutique Hotel',
  'Historic Heritage Palace',
  'Private Cliffside Villa',
  'Eco-Luxury Lodge',
];
const transportationOptions = [
  'Flight & Private Chauffeur',
  'First-Class High Speed Rail',
  'Private Helicopter / Yacht',
  'Luxury Car Rental',
];

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const prefilledDestination = searchParams.get('destination') || '';

  // Form State
  const [formData, setFormData] = useState({
    destination: prefilledDestination || 'Santorini, Greece',
    startingLocation: 'New York / London / Paris',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travelers: 2,
    budget: 3500,
    preferences: ['Relaxation', 'Food', 'Photography'],
    travelType: 'Couple',
    accommodationPreference: 'Luxury Boutique Hotel',
    transportationPreference: 'Flight & Private Chauffeur',
  });

  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [itineraryResult, setItineraryResult] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [savingTrip, setSavingTrip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (prefilledDestination) {
      setFormData((prev) => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  const togglePreference = (pref) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref],
      };
    });
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.destination.trim()) {
      showToast('Please specify a destination.', 'warning');
      return;
    }

    setGenerating(true);
    setItineraryResult(null);

    // Staged realistic progress updates
    const steps = [
      'Connecting to Globetrotter AI Engine...',
      `Analyzing seasonal atmosphere in ${formData.destination}...`,
      'Curating morning, afternoon, and evening excursions...',
      'Synthesizing multi-category budget calculations...',
      'Polishing personalized concierge recommendations...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(currentStep);
      }
    }, 1200);

    try {
      const { data } = await api.post('/ai/generate-itinerary', formData);
      if (data.success && data.data) {
        setItineraryResult(data.data);
        setActiveDayIndex(0);
        showToast('Bespoke itinerary orchestrated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Unable to complete AI generation. Please try again.', 'error');
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      showToast('Please sign in to save this trip to your account.', 'warning');
      navigate('/login', { state: { from: '/plan-trip' } });
      return;
    }

    if (!itineraryResult) return;

    setSavingTrip(true);
    try {
      const tripPayload = {
        title: itineraryResult.title,
        destination: itineraryResult.destination,
        destinationRef: itineraryResult.destinationRef,
        startingLocation: itineraryResult.startingLocation,
        coverImage: itineraryResult.coverImage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        budget: formData.budget,
        preferences: formData.preferences,
        travelType: formData.travelType,
        accommodationPreference: formData.accommodationPreference,
        transportationPreference: formData.transportationPreference,
        status: 'Planned',
        overview: itineraryResult.overview,
        itinerary: itineraryResult.itinerary,
        budgetBreakdown: itineraryResult.budgetBreakdown,
        travelTips: itineraryResult.travelTips,
        isAIGenerated: true,
      };

      const { data } = await api.post('/trips', tripPayload);
      if (data.success) {
        showToast('Trip saved to My Trips!', 'success');
        navigate(`/trip/${data.trip._id}`);
      }
    } catch (err) {
      showToast('Could not save trip. Please check your inputs.', 'error');
    } finally {
      setSavingTrip(false);
    }
  };

  // Allow inline editing of activities
  const handleActivityChange = (dayIdx, timeSlot, field, value) => {
    if (!itineraryResult) return;
    const updated = { ...itineraryResult };
    updated.itinerary[dayIdx][timeSlot][field] = value;
    setItineraryResult(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-bg-card text-gold text-xs font-semibold uppercase tracking-widest shadow-gold-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
          AI Trip Planner
        </h1>
        <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
          Harness Google Gemini intelligence to synthesize a comprehensive day-by-day luxury itinerary,
          complete with activity costs, culinary spots, and insider travel etiquette.
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-bg-card p-6 sm:p-8 rounded-3xl border border-luxury-border/80 shadow-2xl space-y-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Row 1: Destination & Starting Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Where do you want to travel?
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Santorini, Kyoto, Amalfi Coast, Ladakh, Swiss Alps"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Departure City / Country (Optional)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. New York, London Heathrow, Mumbai, Singapore"
                  value={formData.startingLocation}
                  onChange={(e) => setFormData({ ...formData, startingLocation: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Dates, Travelers, Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Total Budget ($ USD)
              </label>
              <input
                type="number"
                min="300"
                step="50"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          {/* Row 3: Travel Type, Accommodation, Transportation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Travel Party Type
              </label>
              <select
                value={formData.travelType}
                onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              >
                {travelTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Accommodation Style
              </label>
              <select
                value={formData.accommodationPreference}
                onChange={(e) => setFormData({ ...formData, accommodationPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              >
                {accommodationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-2">
                Transportation Preference
              </label>
              <select
                value={formData.transportationPreference}
                onChange={(e) => setFormData({ ...formData, transportationPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              >
                {transportationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferences Pills */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-luxury-muted mb-3">
              Select Your Travel Passions
            </label>
            <div className="flex flex-wrap gap-2.5">
              {preferenceOptions.map((pref) => {
                const isSelected = formData.preferences.includes(pref);
                return (
                  <button
                    type="button"
                    key={pref}
                    onClick={() => togglePreference(pref)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gold text-bg-primary shadow-gold-sm'
                        : 'bg-bg-secondary border border-luxury-border text-luxury-muted hover:border-gold/40'
                    }`}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={generating}
              className="px-8 py-4 rounded-xl bg-gold-gradient text-bg-primary font-bold text-sm uppercase tracking-wider shadow-gold-md hover:opacity-95 transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>{generating ? 'Orchestrating Itinerary...' : 'Generate AI Luxury Itinerary'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State Animation */}
      {generating && (
        <div className="p-12 text-center bg-bg-card rounded-3xl border border-gold/40 shadow-2xl space-y-6 animate-fade-in">
          <LoadingSpinner text="Consulting Gemini Neural Travel Matrix..." />
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full bg-bg-secondary h-2 rounded-full overflow-hidden border border-luxury-border">
              <div
                className="h-full bg-gold transition-all duration-700"
                style={{ width: `${(generationStep + 1) * 20}%` }}
              />
            </div>
            <p className="text-xs text-gold-light italic">
              Step {generationStep + 1} of 5: Processing real-world regional logistics
            </p>
          </div>
        </div>
      )}

      {/* Generated Itinerary Display */}
      {itineraryResult && !generating && (
        <div className="space-y-8 animate-fade-in">
          {/* Result Banner */}
          <div className="bg-bg-card p-6 sm:p-8 rounded-3xl border border-gold/50 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-luxury-border/60 pb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-1">
                  Master Itinerary
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-luxury-text">
                  {itineraryResult.title}
                </h2>
                <p className="text-xs text-luxury-muted mt-1">
                  {formData.travelers} Traveler(s) • {formData.startDate} to {formData.endDate} • Budget: ${formData.budget} USD
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    isEditing
                      ? 'bg-gold text-bg-primary font-bold'
                      : 'bg-bg-secondary border border-luxury-border text-luxury-text hover:border-gold'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Itinerary'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-xs font-semibold text-luxury-text hover:border-gold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-gold" />
                  <span>Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTrip}
                  disabled={savingTrip}
                  className="px-6 py-2 rounded-lg bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{savingTrip ? 'Saving...' : 'Save to My Trips'}</span>
                </button>
              </div>
            </div>

            {/* Overview */}
            <p className="text-sm text-luxury-muted leading-relaxed font-normal">
              {itineraryResult.overview}
            </p>

            {/* Budget Breakdown Cards */}
            {itineraryResult.budgetBreakdown && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gold">
                  Estimated Financial Allocation (Verification Advised)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-bg-secondary border border-luxury-border/60">
                    <span className="text-luxury-muted block">Transit / Flight</span>
                    <span className="text-sm font-bold text-luxury-text">
                      ${itineraryResult.budgetBreakdown.transportation || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-secondary border border-luxury-border/60">
                    <span className="text-luxury-muted block">Lodging</span>
                    <span className="text-sm font-bold text-luxury-text">
                      ${itineraryResult.budgetBreakdown.accommodation || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-secondary border border-luxury-border/60">
                    <span className="text-luxury-muted block">Dining & Wine</span>
                    <span className="text-sm font-bold text-luxury-text">
                      ${itineraryResult.budgetBreakdown.food || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-secondary border border-luxury-border/60">
                    <span className="text-luxury-muted block">Activities</span>
                    <span className="text-sm font-bold text-luxury-text">
                      ${itineraryResult.budgetBreakdown.activities || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-secondary border border-luxury-border/60">
                    <span className="text-luxury-muted block">Shopping</span>
                    <span className="text-sm font-bold text-luxury-text">
                      ${itineraryResult.budgetBreakdown.shopping || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-bg-secondary border border-gold/40">
                    <span className="text-gold block font-semibold">Total Projected</span>
                    <span className="text-sm font-bold text-gold">
                      ${itineraryResult.budgetBreakdown.totalEstimated || formData.budget}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Day Navigation Tabs */}
          {itineraryResult.itinerary && itineraryResult.itinerary.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {itineraryResult.itinerary.map((dayItem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeDayIndex === idx
                        ? 'bg-gold text-bg-primary shadow-gold-sm'
                        : 'bg-bg-card border border-luxury-border text-luxury-muted hover:border-gold/50 hover:text-luxury-text'
                    }`}
                  >
                    <span>Day {dayItem.day}</span>
                    <span className="text-[10px] opacity-80">{dayItem.date}</span>
                  </button>
                ))}
              </div>

              {/* Active Day Content */}
              {(() => {
                const day = itineraryResult.itinerary[activeDayIndex];
                if (!day) return null;
                return (
                  <div className="bg-bg-card p-6 sm:p-8 rounded-3xl border border-luxury-border space-y-6 shadow-xl">
                    <div className="border-b border-luxury-border/60 pb-4">
                      <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                        Day {day.day} Itinerary
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-luxury-text mt-1">
                        {day.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Morning */}
                      <div className="p-5 rounded-2xl bg-bg-secondary border border-luxury-border/60 space-y-3">
                        <div className="flex items-center justify-between text-gold text-xs font-bold uppercase tracking-wider">
                          <span>Morning Excursion</span>
                          <span>~${day.morning?.estimatedCost || 0}</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={day.morning?.activity || ''}
                            onChange={(e) =>
                              handleActivityChange(activeDayIndex, 'morning', 'activity', e.target.value)
                            }
                            className="w-full p-2 text-xs bg-bg-card border border-luxury-border rounded text-luxury-text"
                          />
                        ) : (
                          <p className="text-xs text-luxury-text leading-relaxed">
                            {day.morning?.activity}
                          </p>
                        )}
                        <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{day.morning?.location || 'Central Area'}</span>
                        </p>
                      </div>

                      {/* Afternoon */}
                      <div className="p-5 rounded-2xl bg-bg-secondary border border-luxury-border/60 space-y-3">
                        <div className="flex items-center justify-between text-gold text-xs font-bold uppercase tracking-wider">
                          <span>Afternoon Immersion</span>
                          <span>~${day.afternoon?.estimatedCost || 0}</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={day.afternoon?.activity || ''}
                            onChange={(e) =>
                              handleActivityChange(activeDayIndex, 'afternoon', 'activity', e.target.value)
                            }
                            className="w-full p-2 text-xs bg-bg-card border border-luxury-border rounded text-luxury-text"
                          />
                        ) : (
                          <p className="text-xs text-luxury-text leading-relaxed">
                            {day.afternoon?.activity}
                          </p>
                        )}
                        <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{day.afternoon?.location || 'Promenade District'}</span>
                        </p>
                      </div>

                      {/* Evening */}
                      <div className="p-5 rounded-2xl bg-bg-secondary border border-luxury-border/60 space-y-3">
                        <div className="flex items-center justify-between text-gold text-xs font-bold uppercase tracking-wider">
                          <span>Evening Gastronomy</span>
                          <span>~${day.evening?.estimatedCost || 0}</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={day.evening?.activity || ''}
                            onChange={(e) =>
                              handleActivityChange(activeDayIndex, 'evening', 'activity', e.target.value)
                            }
                            className="w-full p-2 text-xs bg-bg-card border border-luxury-border rounded text-luxury-text"
                          />
                        ) : (
                          <p className="text-xs text-luxury-text leading-relaxed">
                            {day.evening?.activity}
                          </p>
                        )}
                        <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{day.evening?.location || 'Skyline Venue'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Day Highlights & Tips */}
                    <div className="pt-4 border-t border-luxury-border/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {day.attractions && day.attractions.length > 0 && (
                        <div>
                          <span className="font-semibold text-gold block mb-1">
                            Key Attractions for Day {day.day}:
                          </span>
                          <p className="text-luxury-muted">
                            {day.attractions.join(' • ')}
                          </p>
                        </div>
                      )}
                      {day.dailyTips && (
                        <div>
                          <span className="font-semibold text-gold block mb-1">
                            Concierge Advice:
                          </span>
                          <p className="text-luxury-muted italic">
                            "{day.dailyTips}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Travel Tips and Disclaimer */}
          {itineraryResult.travelTips && itineraryResult.travelTips.length > 0 && (
            <div className="bg-bg-secondary p-6 rounded-2xl border border-luxury-border space-y-3 text-xs">
              <h4 className="font-serif text-base font-bold text-luxury-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Voyage Protocol & Essential Advice</span>
              </h4>
              <ul className="space-y-1.5 text-luxury-muted">
                {itineraryResult.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-luxury-border/40 text-[10px] text-gray-500">
                Notice: All financial quotes and estimated pricing are approximations generated by AI models and local historical baselines. Real-world airline, lodging, and private charter rates require direct vendor reservation verification.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanTrip;
