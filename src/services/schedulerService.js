import Order from '../models/Order.js';
import SchedulerLog from '../models/SchedulerLog.js';

const PLACED_THRESHOLD_MS = 10 * 60 * 1000;
const PROCESSING_THRESHOLD_MS = 20 * 60 * 1000;

export const runScheduler = async (triggeredBy = 'cron') => {
  const startTime = Date.now();
  const details = [];
  let errorMessage = null;

  try {
    const now = new Date();

    const placedCutoff = new Date(now.getTime() - PLACED_THRESHOLD_MS);
    const processingCutoff = new Date(now.getTime() - PROCESSING_THRESHOLD_MS);

    const ordersToUpdate = await Order.find({
      $or: [
        { status: 'PLACED', updatedAt: { $lt: placedCutoff } },
        { status: 'PROCESSING', updatedAt: { $lt: processingCutoff } },
      ],
    });

    for (const order of ordersToUpdate) {
      const prevStatus = order.status;
      let newStatus;

      if (prevStatus === 'PLACED') {
        newStatus = 'PROCESSING';
      } else if (prevStatus === 'PROCESSING') {
        newStatus = 'READY_TO_SHIP';
      }

      if (!newStatus) continue;

      order.status = newStatus;
      order.statusHistory.push({
        status: newStatus,
        changedAt: now,
        reason: `Auto-updated by scheduler from ${prevStatus} to ${newStatus}`,
      });

      await order.save();
      details.push({ orderId: order.orderId, from: prevStatus, to: newStatus });
    }
  } catch (err) {
    errorMessage = err.message;
    console.error('[Scheduler] Error during run:', err.message);
  }

  const durationMs = Date.now() - startTime;

  await SchedulerLog.create({
    runAt: new Date(),
    triggeredBy,
    ordersUpdated: details.length,
    details,
    durationMs,
    error: errorMessage,
  });

  return { ordersUpdated: details.length, details, durationMs, error: errorMessage };
};
