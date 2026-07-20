import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import {
  createOrderValidator,
  updateOrderValidator,
} from '../validators/orderValidator.js';

const router = express.Router();

router.post('/', createOrderValidator, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderValidator, updateOrder);
router.delete('/:id', deleteOrder);

export default router;
