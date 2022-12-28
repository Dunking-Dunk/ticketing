import { Listener } from "./base-listener"
import { Message } from 'node-nats-streaming'
import { Subjects } from "./subjects"
import { TicketCreatedEvent } from "./ticket-created-event"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated 
    queueGroupName = 'payment-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('event data!', data)

        msg.ack()
    }

}