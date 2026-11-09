import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Compass,
  Phone,
  Edit2,
  Save,
  Heart,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';

const allPreferences = [
  'Adventure',
  'Nature',
  'History',
  'Food',
  'Shopping',
  'Relaxation',
  'Spirituality',
  'Photography',
  'Luxury',
];

const Profile = () => {
  const { user, updateProfile, showToast, toggleFavorite } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ totalTrips: 0, completedTrips: 0, savedDestinationsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form Fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState('');
  const [travelPreferences, setTravelPreferences] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/profile');
      if (data.success) {
        setProfileData(data.user);
        setStats(data.stats);
        setName(data.user.name || '');
        setBio(data.user.bio || '');
        setPhoneNumber(data.user.phoneNumber || '');
        setCountry(data.user.country || '');
        setAvatar(data.user.avatar || '');
        setTravelPreferences(data.user.travelPreferences || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTogglePref = (pref) => {
    if (travelPreferences.includes(pref)) {
      setTravelPreferences(travelPreferences.filter((p) => p !== pref));
    } else {
      setTravelPreferences([...travelPreferences, pref]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateProfile({
      name,
      bio,
      phoneNumber,
      country,
      avatar,
      travelPreferences,
    });
    setSubmitting(false);
    if (res.success) {
      setIsEditing(false);
      fetchProfile();
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving member dossier..." />;
  }

  const savedList = profileData?.savedDestinations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-luxury-border/60 pb-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Membership Dossier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
          Personal Profile & Favorites
        </h1>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-bg-card p-6 sm:p-8 rounded-3xl border border-luxury-border/80 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={profileData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={profileData?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gold/50 shadow-gold-sm"
              />
              {profileData?.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-bg-primary shadow-sm" title="Administrator Privileges">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text">
                  {profileData?.name}
                </h2>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                  {profileData?.role === 'admin' ? 'Administrator' : 'Explorer Member'}
                </span>
              </div>

              <p className="text-xs text-luxury-muted flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>{profileData?.email}</span>
                {profileData?.country && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{profileData.country}</span>
                  </>
                )}
              </p>

              <p className="text-xs text-luxury-text leading-relaxed max-w-xl italic">
                "{profileData?.bio || 'World explorer & luxury travel connoisseur.'}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-center sm:self-start ${
              isEditing
                ? 'bg-gold text-bg-primary font-bold'
                : 'bg-bg-secondary border border-luxury-border text-luxury-text hover:border-gold'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-luxury-border/40">
          <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-wider text-luxury-muted block">Total Voyages</span>
            <span className="font-serif text-2xl font-bold text-luxury-text">{stats.totalTrips}</span>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-wider text-luxury-muted block">Completed Expeditions</span>
            <span className="font-serif text-2xl font-bold text-gold">{stats.completedTrips}</span>
          </div>

          <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-wider text-luxury-muted block">Saved Sanctuaries</span>
            <span className="font-serif text-2xl font-bold text-luxury-text">{savedList.length}</span>
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-6 border-t border-luxury-border space-y-4 animate-fade-in text-xs">
            <h3 className="font-serif text-lg font-bold text-luxury-text">
              Update Profile Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Country of Residence
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                Bio / Explorer Philosophy
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-2 font-semibold">
                Travel Passions & Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {allPreferences.map((pref) => {
                  const sel = travelPreferences.includes(pref);
                  return (
                    <button
                      type="button"
                      key={pref}
                      onClick={() => handleTogglePref(pref)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        sel
                          ? 'bg-gold text-bg-primary shadow-sm font-bold'
                          : 'bg-bg-secondary border border-luxury-border text-luxury-muted hover:border-gold/40'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-luxury-border text-luxury-muted hover:text-luxury-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-gold-gradient text-bg-primary font-bold shadow-gold-sm hover:opacity-95"
              >
                {submitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Saved / Favorite Destinations Section */}
      <div className="space-y-6">
        <div className="border-b border-luxury-border/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="font-serif text-2xl font-bold text-luxury-text">
              Saved Destinations & Sanctuaries
            </h2>
          </div>
          <span className="text-xs text-gold">
            {savedList.length} Bookmarked
          </span>
        </div>

        {savedList.length === 0 ? (
          <div className="p-12 text-center bg-bg-card rounded-2xl border border-luxury-border/60 text-xs text-luxury-muted space-y-2">
            <Heart className="w-10 h-10 text-luxury-muted/30 mx-auto" />
            <p>You haven't bookmarked any favorite destinations yet.</p>
            <p>Click the heart icon on any destination in the Explore tab to curate your wish list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedList.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
