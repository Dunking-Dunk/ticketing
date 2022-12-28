import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { ValidateRequest, requireAuth } from '@hursunss/common'
import { Ticket } from '../models/tickets'
import { natsWrapper } from '../nats-wrapper'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

const router = express.Router()

router.post('/api/tickets', requireAuth,
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').isFloat({gt: 0}).withMessage('price must be greater than 0'),
    ValidateRequest,
    async(req: Request, res: Response) => {
        const { title, price } = req.body
        const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
        await ticket.save()
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })
        res.status(201).send(ticket)
})

export {router as createTicketRouter}