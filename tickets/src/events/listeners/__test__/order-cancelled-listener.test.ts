import { Ticket } from "../../../models/tickets"
import { Message } from "node-nats-streaming"
import { OrderCancelledListener } from "../order-cancelled-listeners"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledEvent } from "@hursunss/common"
import mongoose from "mongoose"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    //create and save a ticket

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket =  Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asfdsf',
    })
    ticket.set({orderId})
   await  ticket.save()
    
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }
        //@ts-ignore
        const msg:Message = {
            ack: jest.fn()
    }
    
    return {listener, data, ticket, msg}
}

it('updates the ticket', async () => {
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket?.orderId).not.toBeDefined()

})

it('publishes an event', async () => {
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('acks the message', async () => { 
    const { msg, ticket, data, listener } = await setup()
    
    await listener.onMessage(data, msg)
    
    expect(msg.ack).toHaveBeenCalled()
})