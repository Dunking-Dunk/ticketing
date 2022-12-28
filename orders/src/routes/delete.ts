import express, {  Request, Response } from 'express';
import { Order, OrderStatus } from '../models/orders';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@hursunss/common';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@hursunss/common';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router()

router.delete('/api/orders/:orderId',requireAuth,async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
        throw new BadRequestError('invalid orderId')
    }
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket');
    
    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    //Publish an event saying that order is cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        }
    })

    res.status(204).send(order)   
})

export { router as deleteOrderRouter}