# Order Management System 🚀

A production-ready full-stack Order Management System built with **Node.js**, **Express.js**, **React (Vite)**, **MongoDB Atlas**, and **node-cron**. The architecture is structured as a robust **Monorepo** with dedicated backend and frontend services.

---

## 📖 Table of Contents
1. [Quick Start](#-quick-start)
2. [Folder Structure](#-folder-structure)
3. [System Design](#-system-design)
4. [Order Status Flow](#-order-status-flow)
5. [Scheduler & Background Tasks](#-scheduler--background-tasks)
6. [API Documentation](#-api-documentation)
7. [Deployment Guide](#-deployment-guide)

---

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Installation
The project uses NPM workspaces to manage dependencies globally. From the root directory:
```bash
# Install all dependencies for root, frontend, and backend
npm run install:all
```

### 3. Environment Setup
Create or edit the `.env` file located in the `backend/` directory:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/orderdb
PORT=3001
NODE_ENV=development
SCHEDULER_SECRET=oms-super-secret-scheduler-key-2024
CORS_ORIGIN=http://localhost:5173
```

### 4. Running the Application
Start both the React frontend and Node backend simultaneously with a single command:
```bash
npm run dev
```
- **Dashboard UI**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001/api`

*(Optional)* Seed the database with 30 realistic mock orders:
```bash
cd backend
npm run seed
```

---

## 📁 Folder Structure
The repository is structured as a monorepo for maximum separation of concerns:
```text
order/
├── backend/               # Node.js + Express API
│   ├── src/               # Routes, Controllers, Models, Cron, Services
│   ├── seed.js            # Mock data generator
│   ├── .env               # Backend secrets
│   └── package.json       # Backend dependencies
├── frontend/              # React + Vite UI
│   ├── src/               # React Components, Pages, Hooks, API layer
│   ├── index.html         # Application entry
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── package.json           # Root workspace manager (concurrently scripts)
└── README.md
```

---

## 🏗 System Design

### Database Choice: MongoDB
MongoDB (NoSQL) was selected because:
1. **Flexible Schema Design**: The `statusHistory` log can be seamlessly embedded within the `orders` document, removing the need for expensive SQL `JOIN` operations.
2. **Horizontal Scalability**: E-commerce order systems naturally experience highly variable write/read loads. MongoDB scales horizontally natively.

### Collections Created
- **`orders`**: Stores the primary order data (`orderId`, `customerName`, `productName`, `amount`, `paymentStatus`, `status`) and embeds an array of status transitions (`statusHistory`).
- **`schedulerlogs`**: Maintains a historical log of every cron execution, tracking `ordersUpdated`, `durationMs`, and detailed transition metrics.

### Race Condition Handling
- **Sequential Mutability**: The background scheduler fetches orders matching the time thresholds and updates them sequentially. 
- **Mongoose Versioning (`__v`)**: Provides Optimistic Concurrency Control, ensuring an older, stale memory document cannot overwrite a newer update from the UI.
- **Timestamp Bumping**: `updatedAt` is inherently modified upon saving, naturally dropping the processed order out of the scheduler's next search query.

### Scalability Roadmap
- **Database**: Add read-replicas for Dashboard API calls, isolating the primary node strictly for write-heavy cron job updates.
- **Backend**: Containerize the Express server in Docker/K8s to scale API pods horizontally behind a load balancer.
- **Scheduler**: Transition from a local `node-cron` instance to a distributed messaging queue (e.g., BullMQ + Redis) or an AWS EventBridge trigger executing an AWS Lambda worker.

---

## 🔄 Order Status Flow

Orders transition through the following pipeline automatically:
```text
[ PLACED ] ──(> 10 min)──► [ PROCESSING ] ──(> 20 min)──► [ READY_TO_SHIP ]
```
Every transition is logged with a timestamp and reason inside the `statusHistory` array of the respective order.

---

## ⏱ Scheduler & Background Tasks

### Mechanism
A `node-cron` job runs natively every 5 minutes inside the backend server (`backend/src/cron/orderCron.js`). 
It identifies stale orders by querying:
- `PLACED` orders where `updatedAt < (Now - 10 minutes)`
- `PROCESSING` orders where `updatedAt < (Now - 20 minutes)`

### Security
The `/api/scheduler/run` and `/api/scheduler/logs` endpoints are protected by the `secretKeyAuth` middleware. They require a valid header matching the environment configuration:
```text
x-secret-key: <SCHEDULER_SECRET>
```

---

## 📖 API Documentation
A complete Postman collection is included in the repository (`postman_collection.json`).

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Fetch orders (supports pagination, filtering by `status`/`paymentStatus`, sorting)
- `GET /api/orders/:id` - Fetch single order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Scheduler Endpoints
- `POST /api/scheduler/run` - Trigger scheduler manually (requires `x-secret-key`)
- `GET /api/scheduler/logs` - View scheduler logs (requires `x-secret-key`)

---

## 🚀 Deployment Guide

### Cloud Deployment (Render, Heroku, Railway)
1. Set the root Build Command: 
   ```bash
   npm run install:all && npm run build --workspace=frontend
   ```
2. Set the root Start Command: 
   ```bash
   npm run start --workspace=backend
   ```
3. Set the environment variables in your cloud provider's dashboard (ensure `NODE_ENV=production`).
4. In production mode, Express automatically serves the built React static files from `frontend/dist`.
