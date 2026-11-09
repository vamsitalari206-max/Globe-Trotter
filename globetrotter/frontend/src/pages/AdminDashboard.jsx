import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Compass,
  CalendarDays,
  Star,
  Plus,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'Mountains',
  'Beaches',
  'Adventure',
  'Historical Places',
  'Temples',
  'Wildlife',
  'Cities',
  'Romantic Destinations',
];

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'destinations' | 'users' | 'reviews'

  // Destination Modal (Add / Edit)
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [destToEdit, setDestToEdit] = useState(null);
  const [destForm, setDestForm] = useState({
    title: '',
    name: '',
    country: '',
    city: '',
    category: 'Romantic Destinations',
    description: '',
    shortDescription: '',
    images: '',
    minBudget: 1500,
    maxBudget: 4500,
    bestTimeToVisit: 'September to May',
    lat: 36.3932,
    lng: 25.4615,
    isFeatured: false,
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, destRes, reviewsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/destinations?limit=100'),
        api.get('/admin/reviews'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (destRes.data.success) setDestinations(destRes.data.destinations);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
    } catch (err) {
      console.error(err);
      showToast('Could not fetch administrative metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Destination Handlers
  const handleOpenAddDest = () => {
    setDestToEdit(null);
    setDestForm({
      title: '',
      name: '',
      country: '',
      city: '',
      category: 'Romantic Destinations',
      description: '',
      shortDescription: '',
      images: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      minBudget: 1500,
      maxBudget: 4500,
      bestTimeToVisit: 'September to May',
      lat: 36.3932,
      lng: 25.4615,
      isFeatured: false,
    });
    setDestModalOpen(true);
  };

  const handleOpenEditDest = (dest) => {
    setDestToEdit(dest);
    setDestForm({
      title: dest.title || '',
      name: dest.name || '',
      country: dest.country || '',
      city: dest.city || '',
      category: dest.category || 'Romantic Destinations',
      description: dest.description || '',
      shortDescription: dest.shortDescription || '',
      images: dest.images?.join(', ') || '',
      minBudget: dest.estimatedBudget?.min || 1000,
      maxBudget: dest.estimatedBudget?.max || 4000,
      bestTimeToVisit: dest.bestTimeToVisit || '',
      lat: dest.coordinates?.lat || 0,
      lng: dest.coordinates?.lng || 0,
      isFeatured: dest.isFeatured || false,
    });
    setDestModalOpen(true);
  };

  const handleDestFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: destForm.title,
        name: destForm.name || destForm.title,
        country: destForm.country,
        city: destForm.city,
        category: destForm.category,
        description: destForm.description,
        shortDescription: destForm.shortDescription,
        images: destForm.images.split(',').map((s) => s.trim()).filter(Boolean),
        estimatedBudget: {
          min: Number(destForm.minBudget),
          max: Number(destForm.maxBudget),
          currency: 'USD',
        },
        bestTimeToVisit: destForm.bestTimeToVisit,
        coordinates: {
          lat: Number(destForm.lat),
          lng: Number(destForm.lng),
        },
        isFeatured: destForm.isFeatured,
      };

      if (destToEdit) {
        await api.put(`/destinations/${destToEdit._id}`, payload);
        showToast('Destination updated.', 'success');
      } else {
        await api.post('/destinations', payload);
        showToast('New destination published.', 'success');
      }

      setDestModalOpen(false);
      fetchAdminData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed.', 'error');
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.delete(`/destinations/${id}`);
      showToast('Destination deleted.', 'info');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to delete destination.', 'error');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const { data } = await api.put(`/admin/destinations/${id}/toggle-featured`);
      if (data.success) {
        showToast(data.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast('Failed to toggle featured status.', 'error');
    }
  };

  // User Handlers
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (data.success) {
        showToast(data.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update role.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all their records?')) return;
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) {
        showToast(data.message, 'info');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete user.', 'error');
    }
  };

  // Review Handlers
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      showToast('Review removed.', 'info');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to delete review.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Accessing sovereign administration console..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-luxury-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
            Admin Dashboard
          </h1>
          <p className="text-sm text-luxury-muted mt-1">
            Oversee user registrations, destination curation, AI travel generation metrics, and review integrity.
          </p>
        </div>

        <button
          onClick={handleOpenAddDest}
          className="px-5 py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border shadow-lg space-y-1">
          <div className="flex items-center justify-between text-luxury-muted">
            <span className="text-xs uppercase tracking-wider font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif text-3xl font-bold text-luxury-text">
            {stats?.stats?.totalUsers || 0}
          </p>
          <span className="text-[10px] text-gray-500">Verified platform accounts</span>
        </div>

        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border shadow-lg space-y-1">
          <div className="flex items-center justify-between text-luxury-muted">
            <span className="text-xs uppercase tracking-wider font-semibold">Destinations</span>
            <Compass className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif text-3xl font-bold text-luxury-text">
            {stats?.stats?.totalDestinations || 0}
          </p>
          <span className="text-[10px] text-gold-light">Curated global sanctuaries</span>
        </div>

        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border shadow-lg space-y-1">
          <div className="flex items-center justify-between text-luxury-muted">
            <span className="text-xs uppercase tracking-wider font-semibold">Orchestrated Trips</span>
            <CalendarDays className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif text-3xl font-bold text-luxury-text">
            {stats?.stats?.totalTrips || 0}
          </p>
          <span className="text-[10px] text-emerald-400">AI and custom voyages</span>
        </div>

        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border shadow-lg space-y-1">
          <div className="flex items-center justify-between text-luxury-muted">
            <span className="text-xs uppercase tracking-wider font-semibold">Traveler Reviews</span>
            <Star className="w-4 h-4 text-gold" />
          </div>
          <p className="font-serif text-3xl font-bold text-luxury-text">
            {stats?.stats?.totalReviews || 0}
          </p>
          <span className="text-[10px] text-gray-500">Community impressions</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-luxury-border/60 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-gold text-bg-primary font-bold shadow-sm'
              : 'text-luxury-muted hover:text-luxury-text'
          }`}
        >
          Overview & Recent
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'destinations'
              ? 'bg-gold text-bg-primary font-bold shadow-sm'
              : 'text-luxury-muted hover:text-luxury-text'
          }`}
        >
          Destinations Management ({destinations.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'bg-gold text-bg-primary font-bold shadow-sm'
              : 'text-luxury-muted hover:text-luxury-text'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'reviews'
              ? 'bg-gold text-bg-primary font-bold shadow-sm'
              : 'text-luxury-muted hover:text-luxury-text'
          }`}
        >
          Moderation & Reviews ({reviews.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Recent Registrations */}
          <div className="bg-bg-card p-6 rounded-3xl border border-luxury-border space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-luxury-text flex items-center justify-between">
              <span>Recent Registrations</span>
              <span className="text-xs text-gold font-normal">Latest 5 Members</span>
            </h3>
            <div className="divide-y divide-luxury-border/40 text-xs">
              {stats?.recentUsers?.map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-gold/40"
                    />
                    <div>
                      <p className="font-semibold text-luxury-text">{u.name}</p>
                      <p className="text-[11px] text-luxury-muted">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-gold border border-gold/30">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-bg-card p-6 rounded-3xl border border-luxury-border space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-luxury-text flex items-center justify-between">
              <span>Recent Voyages Orchestrated</span>
              <span className="text-xs text-gold font-normal">Latest 5 Trips</span>
            </h3>
            <div className="divide-y divide-luxury-border/40 text-xs">
              {stats?.recentTrips?.map((t) => (
                <div key={t._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-luxury-text">{t.title}</p>
                    <p className="text-[11px] text-luxury-muted">
                      {t.destination} • By {t.user?.name || 'Traveler'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gold">${t.budget?.toLocaleString()}</span>
                    <span className="text-[10px] text-luxury-muted block">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESTINATIONS MANAGEMENT */}
      {activeTab === 'destinations' && (
        <div className="bg-bg-card rounded-3xl border border-luxury-border shadow-xl overflow-hidden space-y-4 animate-fade-in">
          <div className="p-6 border-b border-luxury-border/60 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-luxury-text">
                Published Destinations Database
              </h3>
              <p className="text-xs text-luxury-muted">
                Manage global landmarks, categories, budgets, and coordinates
              </p>
            </div>
            <button
              onClick={handleOpenAddDest}
              className="px-4 py-2 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase shadow-sm"
            >
              + Add Destination
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-luxury-muted uppercase tracking-wider font-semibold border-b border-luxury-border/60">
                <tr>
                  <th className="py-3 px-6">Destination</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Budget Range</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6 text-center">Featured</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/40 text-luxury-text">
                {destinations.map((d) => (
                  <tr key={d._id} className="hover:bg-bg-hover transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={d.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80'}
                        alt={d.name}
                        className="w-10 h-10 rounded-lg object-cover border border-luxury-border"
                      />
                      <div>
                        <div className="font-bold text-sm text-luxury-text">{d.name || d.title}</div>
                        <div className="text-[11px] text-luxury-muted">{d.country}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bg-secondary text-gold border border-gold/30">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      ${d.estimatedBudget?.min?.toLocaleString()} - ${d.estimatedBudget?.max?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      ★ {d.rating?.toFixed(1) || '4.8'} ({d.reviewsCount || 0})
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(d._id)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          d.isFeatured
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                            : 'bg-bg-secondary text-gray-500'
                        }`}
                      >
                        {d.isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditDest(d)}
                          className="p-1.5 text-luxury-muted hover:text-gold"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(d._id)}
                          className="p-1.5 text-luxury-muted hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER ACCOUNTS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-bg-card rounded-3xl border border-luxury-border shadow-xl overflow-hidden space-y-4 animate-fade-in">
          <div className="p-6 border-b border-luxury-border/60">
            <h3 className="font-serif text-xl font-bold text-luxury-text">
              User Accounts & Role Permissions
            </h3>
            <p className="text-xs text-luxury-muted">
              Promote verified members to administrator status or manage access permissions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-luxury-muted uppercase tracking-wider font-semibold border-b border-luxury-border/60">
                <tr>
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Country</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-center">Role Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/40 text-luxury-text">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-bg-hover transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-gold/40"
                      />
                      <span className="font-semibold text-luxury-text">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-luxury-muted">{u.email}</td>
                    <td className="py-4 px-6 text-luxury-muted">{u.country || 'N/A'}</td>
                    <td className="py-4 px-6 text-luxury-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleUserRole(u._id, u.role)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                            : 'bg-bg-secondary text-luxury-muted border border-luxury-border'
                        }`}
                        title="Click to toggle Admin / User role"
                      >
                        {u.role === 'admin' ? 'Administrator' : 'Standard User'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-luxury-muted hover:text-red-400"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-bg-card rounded-3xl border border-luxury-border shadow-xl overflow-hidden space-y-4 animate-fade-in">
          <div className="p-6 border-b border-luxury-border/60">
            <h3 className="font-serif text-xl font-bold text-luxury-text">
              Community Review Moderation
            </h3>
            <p className="text-xs text-luxury-muted">
              Inspect submitted reviews, verify ratings, and delete offensive content
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-luxury-muted uppercase tracking-wider font-semibold border-b border-luxury-border/60">
                <tr>
                  <th className="py-3 px-6">Destination</th>
                  <th className="py-3 px-6">Reviewer</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6">Review Comments</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/40 text-luxury-text">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-bg-hover transition-colors">
                    <td className="py-4 px-6 font-semibold text-gold">
                      {r.destination?.title || 'Destination'}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {r.user?.name || 'Explorer'}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gold">
                      ★ {r.rating} / 5
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-semibold text-luxury-text">{r.title}</div>
                      <div className="text-[11px] text-luxury-muted line-clamp-2">{r.comment}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-luxury-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="p-1.5 text-luxury-muted hover:text-red-400"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Destination Add / Edit Modal */}
      {destModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-bg-card border border-luxury-border rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-luxury-border pb-3">
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                {destToEdit ? 'Edit Destination' : 'Add New Luxury Destination'}
              </h3>
              <button
                onClick={() => setDestModalOpen(false)}
                className="text-luxury-muted hover:text-luxury-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDestFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    value={destForm.title}
                    onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Name / City Alias
                  </label>
                  <input
                    type="text"
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Country
                  </label>
                  <input
                    type="text"
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={destForm.city}
                    onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Category
                  </label>
                  <select
                    value={destForm.category}
                    onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Image URLs (Comma separated)
                </label>
                <input
                  type="text"
                  value={destForm.images}
                  onChange={(e) => setDestForm({ ...destForm, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..., https://..."
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    value={destForm.minBudget}
                    onChange={(e) => setDestForm({ ...destForm, minBudget: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    value={destForm.maxBudget}
                    onChange={(e) => setDestForm({ ...destForm, maxBudget: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={destForm.lat}
                    onChange={(e) => setDestForm({ ...destForm, lat: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={destForm.lng}
                    onChange={(e) => setDestForm({ ...destForm, lng: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={destForm.isFeatured}
                  onChange={(e) => setDestForm({ ...destForm, isFeatured: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                <label htmlFor="isFeatured" className="text-luxury-text font-semibold cursor-pointer">
                  Feature this destination on Home landing page
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-luxury-border">
                <button
                  type="button"
                  onClick={() => setDestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-luxury-border text-luxury-muted hover:text-luxury-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-gradient text-bg-primary font-bold shadow-gold-sm"
                >
                  {destToEdit ? 'Save Changes' : 'Publish Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
