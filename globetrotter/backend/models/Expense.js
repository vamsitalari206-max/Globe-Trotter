import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Expense title or description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Transportation',
        'Accommodation',
        'Food',
        'Activities',
        'Shopping',
        'Miscellaneous',
      ],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'Cash', 'Online Transfer', 'Other'],
      default: 'Card',
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ trip: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
