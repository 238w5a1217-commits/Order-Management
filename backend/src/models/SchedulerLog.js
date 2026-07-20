import mongoose from 'mongoose';

const schedulerLogSchema = new mongoose.Schema(
  {
    runAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    triggeredBy: {
      type: String,
      enum: ['cron', 'manual'],
      default: 'cron',
    },
    ordersUpdated: {
      type: Number,
      default: 0,
    },
    details: [
      {
        orderId: String,
        from: String,
        to: String,
        _id: false,
      },
    ],
    durationMs: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const SchedulerLog = mongoose.model('SchedulerLog', schedulerLogSchema);

export default SchedulerLog;
