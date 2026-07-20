import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGODB_URI is missing in environment variables.');
  process.exit(1);
}

const indianNames = [
  'Aarav Sharma', 'Vihaan Patel', 'Vivaan Kumar', 'Ananya Singh', 'Diya Das',
  'Aditya Rao', 'Arjun Gupta', 'Sai Reddy', 'Ayaan Joshi', 'Krishna Iyer',
  'Ishaan Verma', 'Shaurya Nair', 'Kavya Menon', 'Meera Pillai', 'Neha Kapoor',
  'Riya Malhotra', 'Nisha Ahuja', 'Karan Jha', 'Rahul Bose', 'Sneha Chatterjee',
  'Pooja Choudhury', 'Rohan Mehta', 'Vikram Desai', 'Rahul Kulkarni', 'Siddharth Rathi',
  'Tanya Sen', 'Neha Bhat', 'Kritika Pillai', 'Nikhil Saxena', 'Ravi Tiwari',
  'Rajesh Kumar', 'Suresh Raina', 'Mahendra Singh Dhoni', 'Virat Kohli', 'Rohit Sharma',
  'Priyanka Chopra', 'Deepika Padukone', 'Alia Bhatt', 'Shraddha Kapoor', 'Kareena Kapoor',
  'Amitabh Bachchan', 'Shahrukh Khan', 'Salman Khan', 'Aamir Khan', 'Hrithik Roshan',
  'Anushka Sharma', 'Katrina Kaif', 'Ranbir Kapoor', 'Ranveer Singh', 'Akshay Kumar'
];

const products = [
  { name: 'Apple iPhone 16 Pro Max - 256GB', price: 159900 },
  { name: 'Apple iPhone 15 - 128GB', price: 74900 },
  { name: 'Samsung Galaxy S24 Ultra - 512GB', price: 139999 },
  { name: 'Samsung Galaxy Z Fold 5', price: 154999 },
  { name: 'MacBook Air M3 - 16GB/512GB', price: 134900 },
  { name: 'MacBook Pro 14" M3 Pro', price: 199900 },
  { name: 'Dell XPS 15 (2024)', price: 185000 },
  { name: 'ASUS ROG Zephyrus G14', price: 155000 },
  { name: 'Sony PlayStation 5 Console', price: 54990 },
  { name: 'Microsoft Xbox Series X', price: 49990 },
  { name: 'Sony WH-1000XM5 Wireless Headphones', price: 29990 },
  { name: 'Bose QuietComfort Ultra', price: 35900 },
  { name: 'Apple AirPods Pro (2nd Gen)', price: 24900 },
  { name: 'Apple Watch Ultra 2', price: 89900 },
  { name: 'Samsung Galaxy Watch 6 Classic', price: 36999 },
  { name: 'iPad Pro 11" M4 - 256GB', price: 99900 },
  { name: 'LG C3 55" 4K OLED TV', price: 139990 },
  { name: 'Samsung 990 PRO 2TB NVMe SSD', price: 18999 },
  { name: 'Logitech MX Master 3S Mouse', price: 10995 },
  { name: 'Keychron K2 Wireless Mechanical Keyboard', price: 8500 }
];

const generatePhone = () => {
  const prefixes = ['9', '8', '7', '6'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${prefix}${rest}`;
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTimestamp = () => {
  const now = new Date();
  const category = Math.random();
  
  let timeOffset = 0;
  if (category < 0.25) {
    // Within last 5 mins
    timeOffset = Math.random() * 5 * 60 * 1000;
  } else if (category < 0.5) {
    // Older than 10 mins (between 10 and 15)
    timeOffset = (10 + Math.random() * 5) * 60 * 1000;
  } else if (category < 0.75) {
    // Older than 20 mins (between 20 and 40)
    timeOffset = (20 + Math.random() * 20) * 60 * 1000;
  } else {
    // 1-3 days old
    timeOffset = (1 + Math.random() * 2) * 24 * 60 * 60 * 1000;
  }
  
  return new Date(now.getTime() - timeOffset);
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Order.deleteMany({});
    console.log('Existing orders cleared');

    const ordersToInsert = [];
    let startOrderId = 1001;
    
    const shuffledNames = shuffleArray(indianNames);

    for (let i = 0; i < 30; i++) {
      const product = getRandomElement(products);
      
      const statusOptions = ['PLACED', 'PROCESSING', 'READY_TO_SHIP'];
      const status = getRandomElement(statusOptions);

      // Generate a timestamp that makes sense for the status so the scheduler doesn't instantly upgrade it
      const now = new Date();
      let timeOffset = 0;
      
      if (status === 'PLACED') {
        // PLACED threshold is 10 mins. Keep it within last 8 mins
        timeOffset = Math.random() * 8 * 60 * 1000;
      } else if (status === 'PROCESSING') {
        // PROCESSING threshold is 20 mins. Keep it between 11 and 18 mins ago
        timeOffset = (11 + Math.random() * 7) * 60 * 1000;
      } else {
        // READY_TO_SHIP can be older than 20 mins (e.g. 21 mins to 3 days)
        timeOffset = (21 + Math.random() * 4000) * 60 * 1000; 
      }
      const timestamp = new Date(now.getTime() - timeOffset);

      const paymentStatusOptions = ['PAID', 'UNPAID'];
      const paymentStatus = getRandomElement(paymentStatusOptions);
      
      const customerName = shuffledNames[i % shuffledNames.length];

      const orderData = {
        orderId: `ORD${startOrderId++}`,
        customerName: customerName,
        phone: generatePhone(),
        productName: product.name,
        amount: product.price,
        paymentStatus,
        status,
        createdAt: timestamp,
        updatedAt: timestamp,
        statusHistory: [
          {
            status: 'PLACED',
            changedAt: timestamp,
            reason: 'Order created'
          }
        ]
      };

      // Add a status history entry if the order is not just PLACED
      if (status !== 'PLACED') {
         orderData.statusHistory.push({
           status: status,
           changedAt: new Date(timestamp.getTime() + 1000),
           reason: 'System updated status'
         });
      }

      ordersToInsert.push(orderData);
    }

    const result = await Order.insertMany(ordersToInsert);
    console.log(`Successfully inserted ${result.length} realistic orders.`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();
