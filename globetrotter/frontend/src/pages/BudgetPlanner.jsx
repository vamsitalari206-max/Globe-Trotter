import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PieChart as PieChartIcon,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Filter,
  ArrowUpRight,
  CreditCard,
  Calendar,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ExpenseModal from '../components/ExpenseModal';

const CATEGORY_COLORS = {
  Transportation: '#D6B477',
  Accommodation: '#38BDF8',
  Food: '#FB923C',
  Activities: '#4ADE80',
  Shopping: '#F472B6',
  Miscellaneous: '#A78BFA',
};

const BudgetPlanner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTripId = searchParams.get('tripId') || '';

  const { showToast } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(urlTripId);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expenses, setExpenses] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Fetch Trips for Dropdown
  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        if (data.success) {
          setTrips(data.trips);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserTrips();
  }, []);

  // Fetch Expenses & Aggregates
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedTripId) params.tripId = selectedTripId;

      const { data } = await api.get('/expenses', { params });
      if (data.success) {
        setExpenses(data.expenses);
        setCategoryBreakdown(data.categoryBreakdown || []);
        setTotalSpent(data.totalSpent || 0);
        setTripDetails(data.tripDetails);
      }
    } catch (err) {
      console.error(err);
      showToast('Could not load expense records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedTripId]);

  const handleTripSelectChange = (e) => {
    const newTripId = e.target.value;
    setSelectedTripId(newTripId);
    if (newTripId) {
      setSearchParams({ tripId: newTripId });
    } else {
      setSearchParams({});
    }
  };

  const handleExpenseSubmit = async (formData, expenseId) => {
    try {
      if (expenseId) {
        await api.put(`/expenses/${expenseId}`, formData);
        showToast('Expense updated successfully.', 'success');
      } else {
        await api.post('/expenses', formData);
        showToast('Expense logged successfully.', 'success');
      }
      fetchExpenses();
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Could not record expense.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Delete this expense entry?')) return;
    try {
      await api.delete(`/expenses/${expenseId}`);
      showToast('Expense deleted.', 'info');
      fetchExpenses();
    } catch (err) {
      showToast('Failed to delete expense.', 'error');
    }
  };

  // Filtered expense items by category
  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  // Prepare chart data for Recharts Pie
  const pieData = categoryBreakdown
    .filter((cat) => cat.total > 0)
    .map((cat) => ({
      name: cat.category,
      value: cat.total,
      color: CATEGORY_COLORS[cat.category] || '#D6B477',
    }));

  // Prepare Bar chart data comparing estimated vs actual if tripDetails exists
  const barData = categoryBreakdown.map((cat) => {
    const catKey = cat.category.toLowerCase();
    const estimated = tripDetails?.budgetBreakdown?.[catKey] || 0;
    return {
      category: cat.category.slice(0, 5),
      fullCategory: cat.category,
      Actual: cat.total,
      Estimated: estimated,
    };
  });

  const totalBudget = tripDetails?.budget || (totalSpent > 0 ? totalSpent * 1.25 : 5000);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const spentPct = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-luxury-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold mb-1">
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Financial Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
            Smart Budget Planner
          </h1>
          <p className="text-sm text-luxury-muted mt-1">
            Monitor real-time expenditures across flights, luxury lodging, Michelin dining, and activities with predictive variances.
          </p>
        </div>

        <button
          onClick={() => {
            setExpenseToEdit(null);
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Filter / Selector Bar */}
      <div className="bg-bg-card p-4 sm:p-5 rounded-2xl border border-luxury-border/80 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
              Filter by Journey
            </label>
            <select
              value={selectedTripId}
              onChange={handleTripSelectChange}
              className="px-3.5 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold min-w-[200px]"
            >
              <option value="">All Voyages (Consolidated Ledger)</option>
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title} ({t.destination})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold min-w-[160px]"
            >
              <option value="All">All Categories</option>
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tripDetails && (
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-gold font-semibold block">
              Active Voyage
            </span>
            <span className="text-sm font-bold text-luxury-text">
              {tripDetails.title}
            </span>
          </div>
        )}
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border space-y-2 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-luxury-muted font-semibold">
            {tripDetails ? 'Trip Budget Target' : 'Aggregate Portfolio Budget'}
          </span>
          <p className="font-serif text-3xl font-bold text-luxury-text">
            ${totalBudget.toLocaleString()}
          </p>
          <span className="text-[11px] text-luxury-muted block">
            Target capital benchmark
          </span>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border space-y-2 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-luxury-muted font-semibold">
            Total Disbursed Expenses
          </span>
          <p className="font-serif text-3xl font-bold text-gold">
            ${totalSpent.toLocaleString()}
          </p>
          <div className="w-full bg-bg-secondary h-2 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full ${spentPct > 90 ? 'bg-red-500' : 'bg-gold'}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <span className="text-[11px] text-gold-light block">
            {spentPct}% utilized
          </span>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border space-y-2 shadow-lg">
          <span className="text-xs uppercase tracking-wider text-luxury-muted font-semibold">
            Remaining Liquidity
          </span>
          <p className="font-serif text-3xl font-bold text-emerald-400">
            ${remainingBudget.toLocaleString()}
          </p>
          <span className="text-[11px] text-luxury-muted block">
            Available surplus for unplanned indulgences
          </span>
        </div>
      </div>

      {/* Visual Analytics Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-6 bg-bg-card p-6 rounded-3xl border border-luxury-border shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
            <h3 className="font-serif text-xl font-bold text-luxury-text">
              Expense Allocation by Category
            </h3>
            <span className="text-xs text-gold font-semibold">Percentages</span>
          </div>

          {pieData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111720',
                      borderColor: '#D6B477',
                      borderRadius: '8px',
                      color: '#F5F2EC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`$${Number(val).toLocaleString()} USD`, 'Spent']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-luxury-muted text-xs">
              <PieChartIcon className="w-10 h-10 text-gold/30 mb-2" />
              <span>Log expenses to visualize category distributions.</span>
            </div>
          )}
        </div>

        {/* Estimated vs Actual Bar Chart */}
        <div className="lg:col-span-6 bg-bg-card p-6 rounded-3xl border border-luxury-border shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
            <h3 className="font-serif text-xl font-bold text-luxury-text">
              Category Spending vs Forecast
            </h3>
            <span className="text-xs text-gold font-semibold">USD Comparisons</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="category" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111720',
                    borderColor: '#D6B477',
                    borderRadius: '8px',
                    color: '#F5F2EC',
                    fontSize: '12px',
                  }}
                  formatter={(val, name) => [`$${val} USD`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Actual" fill="#D6B477" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estimated" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Expense Ledger Table */}
      <div className="bg-bg-card rounded-3xl border border-luxury-border shadow-xl overflow-hidden space-y-4">
        <div className="p-6 border-b border-luxury-border/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-luxury-text">
              Expense Ledger Entries
            </h3>
            <p className="text-xs text-luxury-muted mt-0.5">
              Showing {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Compiling financial audits..." />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-luxury-muted space-y-3">
            <DollarSign className="w-10 h-10 text-gold/30 mx-auto" />
            <p>No expense transactions match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-luxury-muted uppercase tracking-wider font-semibold border-b border-luxury-border/60">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Description / Merchant</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6">Associated Trip</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/40 text-luxury-text">
                {filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-bg-hover transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap text-luxury-muted">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      <div>{exp.title}</div>
                      {exp.notes && (
                        <div className="text-[11px] text-luxury-muted">{exp.notes}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[exp.category] || '#D6B477'}20`,
                          color: CATEGORY_COLORS[exp.category] || '#D6B477',
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-luxury-muted">
                      {exp.paymentMethod || 'Card'}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-luxury-muted">
                      {exp.trip?.title || 'Trip'}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right font-serif font-bold text-sm text-gold">
                      ${exp.amount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setExpenseToEdit(exp);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-luxury-muted hover:text-gold transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="p-1.5 text-luxury-muted hover:text-red-400 transition-colors"
                          title="Delete Expense"
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
        )}
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSubmit={handleExpenseSubmit}
        expenseToEdit={expenseToEdit}
        tripId={selectedTripId}
        trips={trips}
      />
    </div>
  );
};

export default BudgetPlanner;
