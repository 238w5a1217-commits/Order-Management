import cron from 'node-cron';
import { runScheduler } from '../services/schedulerService.js';

const startCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log(`[Cron] Running scheduler at ${new Date().toISOString()}`);
    const result = await runScheduler('cron');
    console.log(`[Cron] Done. ${result.ordersUpdated} order(s) updated in ${result.durationMs}ms`);
  });
  console.log(' Cron job registered: runs every 5 minutes');
};

export default startCron;
