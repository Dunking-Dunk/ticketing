import nats from 'node-nats-streaming'
import {randomBytes} from 'crypto'
import {TicketCreatedListener} from './events/ticket-created-listeners'


const sc = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

sc.on('connect', () => {
    new TicketCreatedListener(sc).listen()
})



