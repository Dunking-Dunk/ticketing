import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/tickets'
import mongoose from 'mongoose'
import {natsWrapper} from '../../nats-wrapper'

it('return 404 it the ticket requested not found', async() => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'askndffd',
            price: 20
    }).expect(404)
})


it('return 401 it the user is not authenticated', async() => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'askndffd',
            price: 20
    }).expect(401)
})

it('return 401 it the user not owned the ticket', async() => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'fsfsfsf', price: 20 })
    
    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin()).send({
            title: 'alsfsfsf',
            price: 1000
    }).expect(401)
})

it('return 400 if the user provides an invalid title or price ', async () => {
    const cookie = global.signin()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'fsfsfsf', price: 20 })
    
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: '', price: 20 }).expect(400)

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'fdfdf', price: -20 }).expect(400)
})

it('updated the ticket provided valid inputs', async() => {
    const cookie = global.signin()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'fsfsfsf', price: 20 })

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'hursun is fsfsfs', price: 100 }).expect(200)

    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send()

    expect(ticketResponse.body.title).toEqual('hursun is fsfsfs')
    expect(ticketResponse.body.price).toEqual(100)
})

it('publishes an event', async () => { 
    const cookie = global.signin()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'fsfsfsf', price: 20 })

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({ title: 'hursun is fsfsfs', price: 100 }).expect(200)

     await request(app).get(`/api/tickets/${response.body.id}`).send()

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => { 
    const cookie = global.signin()
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'fsfsfsf', price: 20 })
    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        price: 100,
        title: 'lol'
    }).expect(400)
})