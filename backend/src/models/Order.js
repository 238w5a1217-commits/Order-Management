import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'UNPAID'],
      required: true,
      default: 'UNPAID',
    },
    status: {
      type: String,
      enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP'],
      default: 'PLACED',
      index: true,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto-generate orderId before saving
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `ORD-${timestamp}-${random}`;
    // Seed initial status history
    this.statusHistory.push({
      status: 'PLACED',
      changedAt: new Date(),
      reason: 'Order created',
    });
  }
  next();
});

// Compound index for scheduler queries
orderSchema.index({ status: 1, updatedAt: 1 });
orderSchema.index({ customerName: 'text', orderId: 'text' });

const Order = mongoose.model('Order', orderSchema);

export default Order;
