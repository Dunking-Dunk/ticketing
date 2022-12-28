import nats from 'node-nats-streaming'
import {TicketCreatedPublisher} from './events/ticket-created-publisher'

console.clear()

const sc = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
}) 

sc.on('connect', () => {

    new TicketCreatedPublisher(sc).publish({
        id: '123',
        title: 'concert',
        price: 20
 })
    
})