import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateOrder } from '../structs/orderStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { prisma } from '../utils/prismaClient.js';
import { OrderController } from '../controller/orderController.js';
const orderRouter = express.Router();

orderRouter.route('/').post(validate(CreateOrder), tryCatchHandler(OrderController.createOrder));

export default orderRouter;
