import { runScheduler } from '../services/schedulerService.js';
import SchedulerLog from '../models/SchedulerLog.js';

export const triggerScheduler = async (req, res, next) => {
  try {
    const result = await runScheduler('manual');
    res.json({
      success: true,
      message: `Scheduler completed. ${result.ordersUpdated} order(s) updated.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchedulerLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      SchedulerLog.find().sort({ runAt: -1 }).skip(skip).limit(limitNum).lean(),
      SchedulerLog.countDocuments(),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
