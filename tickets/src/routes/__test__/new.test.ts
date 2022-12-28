import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/tickets'
import {natsWrapper} from '../../nats-wrapper'


it('has a route handler listening to /api/tickets for post rquests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
    
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user us signed in', async () => {
 await request(app)
        .post('/api/tickets')
        .send({})
    .expect(401)
    
})

it('return a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({})
    
    expect(response.status).not.toEqual(401)
})

it('returns a error if invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400)
    
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
    .expect(400)
})

it('returns a error if invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '54gfgdgr',
        price: -20 
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'dffdfre'
    })
.expect(400)
})

it('creates ticket with valid input', async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)
    await request(app).post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'fdfd',
            price: 23
        }).expect(201)
    
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(23)
})

it('publishes an event', async () => { 
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'fdfd',
        price: 23
    }).expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})