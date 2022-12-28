import { Ticket } from "../../../models/tickets"
import { Message } from "node-nats-streaming"
import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedEvent, OrderStatus } from "@hursunss/common"
import mongoose from "mongoose"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    //create and save a ticket

    const ticket =  Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asfdsf'
    })

   await  ticket.save()
    
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'fessfsf',
        expiredAt: 'dfdfdf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, ticket, msg}
}

it('sets the userId of the ticket', async() => {
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('ack the message', async() => {
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event', async () => {
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId)
})