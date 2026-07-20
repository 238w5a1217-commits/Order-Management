import express from 'express';
import secretKeyAuth from '../middlewares/secretKeyAuth.js';
import {
  triggerScheduler,
  getSchedulerLogs,
} from '../controllers/schedulerController.js';

const router = express.Router();

router.post('/run', secretKeyAuth, triggerScheduler);
router.get('/logs', secretKeyAuth, getSchedulerLogs);

export default router;
