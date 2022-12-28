import { OrderCreatedEvent, OrderStatus } from "@hursunss/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const data: OrderCreatedEvent['data'] = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            status: OrderStatus.Created,
            userId: 'fessfsf',
            expiredAt: 'dfdfdf',
            ticket: {
                id: 'gfgfg',
                price: 20,
            }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}

it('replicate the order info', async () => { 
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg)
    
    const order = await Order.findById(data.id)

    expect(order?.id).toEqual(data.id)
    expect(order!.price).toEqual(data.ticket.price)
})

it('acks the msg', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg)
    
    expect(msg.ack).toHaveBeenCalled()
})