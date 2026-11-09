import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, CreditCard, Calendar, FileText } from 'lucide-react';

const categories = [
  'Transportation',
  'Accommodation',
  'Food',
  'Activities',
  'Shopping',
  'Miscellaneous',
];

const paymentMethods = ['Card', 'Cash', 'Online Transfer', 'Other'];

const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  expenseToEdit = null,
  tripId = '',
  trips = [],
}) => {
  const [formData, setFormData] = useState({
    trip: tripId || '',
    title: '',
    amount: '',
    category: 'Transportation',
    paymentMethod: 'Card',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        trip: expenseToEdit.trip?._id || expenseToEdit.trip || tripId || '',
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'Transportation',
        paymentMethod: expenseToEdit.paymentMethod || 'Card',
        date: expenseToEdit.date ? expenseToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expenseToEdit.notes || '',
      });
    } else {
      setFormData({
        trip: tripId || (trips.length > 0 ? trips[0]._id : ''),
        title: '',
        amount: '',
        category: 'Transportation',
        paymentMethod: 'Card',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setError('');
  }, [expenseToEdit, tripId, isOpen, trips]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trip) {
      setError('Please select or specify a trip.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please provide an expense title or merchant name.');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(formData, expenseToEdit?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card border border-luxury-border/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-luxury-border/60 bg-bg-secondary">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg font-bold text-luxury-text">
              {expenseToEdit ? 'Edit Expense' : 'Log New Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-luxury-muted hover:text-luxury-text transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Select Trip if not locked to tripId */}
          {!tripId && trips.length > 0 && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
                Associated Trip
              </label>
              <select
                value={formData.trip}
                onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              >
                <option value="">Select a journey</option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({t.destination})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
              Expense Title / Merchant
            </label>
            <input
              type="text"
              placeholder="e.g. Flight to Santorini, Villa Deposit, Michelin Dinner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              required
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
              >
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Receipt details, reference number, or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-luxury-border text-xs font-semibold text-luxury-muted hover:text-luxury-text hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gold-gradient text-bg-primary text-xs font-bold shadow-gold-sm hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : expenseToEdit ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
