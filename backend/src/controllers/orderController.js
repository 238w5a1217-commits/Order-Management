import { validationResult } from 'express-validator';
import Order from '../models/Order.js';

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return true;
  }
  return false;
};

export const createOrder = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;
    const { customerName, phone, productName, amount, paymentStatus } = req.body;
    const order = new Order({ customerName, phone, productName, amount, paymentStatus });
    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const {
      status,
      paymentStatus,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { customerName: searchRegex },
        { orderId: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortDir = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDir };

    const filterWithoutStatus = { ...filter };
    delete filterWithoutStatus.status;

    const [orders, total, placedCount, processingCount, readyCount] = await Promise.all([
      Order.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Order.countDocuments(filter),
      Order.countDocuments({ ...filterWithoutStatus, status: 'PLACED' }),
      Order.countDocuments({ ...filterWithoutStatus, status: 'PROCESSING' }),
      Order.countDocuments({ ...filterWithoutStatus, status: 'READY_TO_SHIP' })
    ]);

    res.json({
      success: true,
      data: orders,
      statusCounts: {
        PLACED: placedCount,
        PROCESSING: processingCount,
        READY_TO_SHIP: readyCount,
      },
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

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { customerName, phone, productName, amount, paymentStatus, status } = req.body;

    if (customerName !== undefined) order.customerName = customerName;
    if (phone !== undefined) order.phone = phone;
    if (productName !== undefined) order.productName = productName;
    if (amount !== undefined) order.amount = amount;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    if (status !== undefined && status !== order.status) {
      const prevStatus = order.status;
      order.status = status;
      order.statusHistory.push({
        status,
        changedAt: new Date(),
        reason: `Manually updated from ${prevStatus} to ${status}`,
      });
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};
