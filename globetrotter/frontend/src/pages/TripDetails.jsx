import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  Trash2,
  Edit2,
  Save,
  Plus,
  TrendingUp,
  PieChart,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ExpenseModal from '../components/ExpenseModal';

const statusList = ['Planned', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  // Edit Trip Modal / State
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 1000,
    status: 'Planned',
  });

  // Expense Modal State
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const fetchTripDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/trips/${id}`);
      if (data.success) {
        setTrip(data.trip);
        setExpenses(data.expenses || []);
        setEditFormData({
          title: data.trip.title,
          startDate: data.trip.startDate ? data.trip.startDate.split('T')[0] : '',
          endDate: data.trip.endDate ? data.trip.endDate.split('T')[0] : '',
          travelers: data.trip.travelers,
          budget: data.trip.budget,
          status: data.trip.status,
        });
      }
    } catch (err) {
      showToast('Failed to load trip dossier.', 'error');
      navigate('/my-trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/trips/${id}`, editFormData);
      if (data.success) {
        setTrip({ ...trip, ...data.trip });
        setIsEditingTrip(false);
        showToast('Trip parameters updated successfully.', 'success');
      }
    } catch (err) {
      showToast('Failed to update trip.', 'error');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.put(`/trips/${id}`, { status: newStatus });
      if (data.success) {
        setTrip({ ...trip, status: newStatus });
        showToast(`Trip marked as ${newStatus}`, 'info');
      }
    } catch (err) {
      showToast('Could not update status.', 'error');
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip and all recorded expenses?')) return;
    try {
      await api.delete(`/trips/${id}`);
      showToast('Trip deleted.', 'info');
      navigate('/my-trips');
    } catch (err) {
      showToast('Failed to delete trip.', 'error');
    }
  };

  const handleExpenseSubmit = async (formData, expenseId) => {
    try {
      if (expenseId) {
        await api.put(`/expenses/${expenseId}`, formData);
        showToast('Expense updated.', 'success');
      } else {
        await api.post('/expenses', formData);
        showToast('Expense logged.', 'success');
      }
      fetchTripDetails(); // Refresh to recalculate budget totals
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Expense save failed.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      showToast('Expense removed.', 'info');
      fetchTripDetails();
    } catch (err) {
      showToast('Failed to delete expense.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving voyage itinerary..." />;
  }

  if (!trip) return null;

  const totalSpent = trip.spentBudget || expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, trip.budget - totalSpent);
  const spentPct = Math.min(100, Math.round((totalSpent / (trip.budget || 1)) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-trips"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditingTrip(true)}
            className="p-2.5 rounded-xl bg-bg-card border border-luxury-border text-luxury-muted hover:text-gold hover:border-gold transition-all"
            title="Edit Trip Settings"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteTrip}
            className="p-2.5 rounded-xl bg-bg-card border border-luxury-border text-luxury-muted hover:text-red-400 hover:border-red-500/50 transition-all"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-luxury-border shadow-2xl bg-bg-card">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

          {/* Top Status Dropdown */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <select
              value={trip.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-bg-primary/90 text-gold border border-gold/40 focus:outline-none backdrop-blur-md cursor-pointer"
            >
              {statusList.map((st) => (
                <option key={st} value={st} className="bg-bg-primary text-luxury-text">
                  Status: {st}
                </option>
              ))}
            </select>
            {trip.isAIGenerated && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-bg-primary shadow-sm">
                AI Architected
              </span>
            )}
          </div>

          {/* Title & Metadata on Banner bottom */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text leading-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-luxury-muted pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold" />
                <span>{trip.travelers} Traveler(s)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-gold" />
                <span>Budget: ${trip.budget?.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border/80 space-y-1">
          <span className="text-xs uppercase tracking-wider text-luxury-muted">Total Budget</span>
          <p className="font-serif text-2xl font-bold text-luxury-text">
            ${trip.budget?.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500">Allocated budget ceiling</span>
        </div>

        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border/80 space-y-1">
          <span className="text-xs uppercase tracking-wider text-luxury-muted">Spent To Date</span>
          <p className="font-serif text-2xl font-bold text-gold">
            ${totalSpent.toLocaleString()}
          </p>
          <div className="w-full bg-bg-secondary h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${spentPct > 90 ? 'bg-red-500' : 'bg-gold'}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
        </div>

        <div className="bg-bg-card p-5 rounded-2xl border border-luxury-border/80 space-y-1">
          <span className="text-xs uppercase tracking-wider text-luxury-muted">Remaining Balance</span>
          <p className="font-serif text-2xl font-bold text-emerald-400">
            ${remainingBudget.toLocaleString()}
          </p>
          <span className="text-[11px] text-luxury-muted">
            {100 - spentPct}% available for disbursement
          </span>
        </div>
      </div>

      {/* Main Grid: Day-wise Itinerary Left, Expenses Ledger Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Itinerary Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
            <h2 className="font-serif text-2xl font-bold text-luxury-text">
              Day-Wise Master Itinerary
            </h2>
            <span className="text-xs text-gold">
              {trip.itinerary?.length || 0} Day Expedition
            </span>
          </div>

          {trip.overview && (
            <div className="p-4 rounded-xl bg-bg-card border border-luxury-border/60 text-xs text-luxury-muted leading-relaxed">
              {trip.overview}
            </div>
          )}

          {trip.itinerary && trip.itinerary.length > 0 ? (
            <div className="space-y-4">
              {/* Day Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {trip.itinerary.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeDayIdx === idx
                        ? 'bg-gold text-bg-primary shadow-gold-sm font-bold'
                        : 'bg-bg-card border border-luxury-border text-luxury-muted hover:text-luxury-text'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {/* Active Day Detail Card */}
              {(() => {
                const day = trip.itinerary[activeDayIdx];
                if (!day) return null;
                return (
                  <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border space-y-6 shadow-xl animate-fade-in">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                        Day {day.day} {day.date ? `• ${day.date}` : ''}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-luxury-text mt-1">
                        {day.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Morning */}
                      <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 space-y-1.5">
                        <div className="flex items-center justify-between text-gold text-xs font-semibold uppercase tracking-wider">
                          <span>Morning Excursion</span>
                          {day.morning?.estimatedCost > 0 && (
                            <span>~${day.morning.estimatedCost}</span>
                          )}
                        </div>
                        <p className="text-xs text-luxury-text leading-relaxed">
                          {day.morning?.activity}
                        </p>
                        {day.morning?.location && (
                          <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold" />
                            <span>{day.morning.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Afternoon */}
                      <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 space-y-1.5">
                        <div className="flex items-center justify-between text-gold text-xs font-semibold uppercase tracking-wider">
                          <span>Afternoon Immersion</span>
                          {day.afternoon?.estimatedCost > 0 && (
                            <span>~${day.afternoon.estimatedCost}</span>
                          )}
                        </div>
                        <p className="text-xs text-luxury-text leading-relaxed">
                          {day.afternoon?.activity}
                        </p>
                        {day.afternoon?.location && (
                          <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold" />
                            <span>{day.afternoon.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Evening */}
                      <div className="p-4 rounded-xl bg-bg-secondary border border-luxury-border/60 space-y-1.5">
                        <div className="flex items-center justify-between text-gold text-xs font-semibold uppercase tracking-wider">
                          <span>Evening Gastronomy</span>
                          {day.evening?.estimatedCost > 0 && (
                            <span>~${day.evening.estimatedCost}</span>
                          )}
                        </div>
                        <p className="text-xs text-luxury-text leading-relaxed">
                          {day.evening?.activity}
                        </p>
                        {day.evening?.location && (
                          <p className="text-[11px] text-luxury-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold" />
                            <span>{day.evening.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {day.dailyTips && (
                      <div className="p-3 bg-bg-secondary rounded-lg border border-luxury-border/40 text-xs text-luxury-muted italic">
                        Concierge Tip: "{day.dailyTips}"
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="text-xs text-luxury-muted italic">
              No day-wise itinerary recorded. You can add one using the AI planner.
            </p>
          )}
        </div>

        {/* Right Expenses Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
            <h2 className="font-serif text-2xl font-bold text-luxury-text">
              Recorded Expenses
            </h2>
            <button
              onClick={() => {
                setExpenseToEdit(null);
                setExpenseModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-gold-sm hover:opacity-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center bg-bg-card rounded-2xl border border-luxury-border space-y-3">
              <DollarSign className="w-10 h-10 text-gold/40 mx-auto" />
              <p className="text-xs text-luxury-muted">
                No expenses logged for this voyage yet. Record flights, accommodations, dining, and activities to track your budget variance.
              </p>
              <button
                onClick={() => {
                  setExpenseToEdit(null);
                  setExpenseModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-gold text-bg-primary text-xs font-bold"
              >
                Log First Expense
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="p-4 rounded-xl bg-bg-card border border-luxury-border/60 flex items-center justify-between hover:border-gold/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </span>
                    <h4 className="text-sm font-semibold text-luxury-text">
                      {exp.title}
                    </h4>
                    {exp.notes && (
                      <p className="text-[11px] text-luxury-muted">
                        {exp.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-base text-luxury-text">
                      ${exp.amount?.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        setExpenseToEdit(exp);
                        setExpenseModalOpen(true);
                      }}
                      className="p-1.5 text-luxury-muted hover:text-gold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      className="p-1.5 text-luxury-muted hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <Link
                to={`/budget?tripId=${trip._id}`}
                className="block text-center py-2 text-xs text-gold hover:underline font-semibold"
              >
                Open in Full Budget Visualizer & Charts →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Trip Modal */}
      {isEditingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-luxury-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-border pb-3">
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Edit Trip Parameters
              </h3>
              <button
                onClick={() => setIsEditingTrip(false)}
                className="text-luxury-muted hover:text-luxury-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTrip} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Trip Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.travelers}
                    onChange={(e) => setEditFormData({ ...editFormData, travelers: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
                >
                  {statusList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTrip(false)}
                  className="px-4 py-2 rounded-lg border border-luxury-border text-luxury-muted hover:text-luxury-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-gradient text-bg-primary font-bold shadow-gold-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSubmit={handleExpenseSubmit}
        expenseToEdit={expenseToEdit}
        tripId={trip._id}
      />
    </div>
  );
};

export default TripDetails;
