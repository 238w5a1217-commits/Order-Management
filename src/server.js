import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import startCron from './cron/orderCron.js';

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
  startCron();
};

start();
