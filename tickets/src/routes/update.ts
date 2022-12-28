import express, { Request, Response } from 'express'
import {body} from 'express-validator'
import { Ticket } from '../models/tickets'
import { NotFoundError, ValidateRequest, requireAuth, NotAuthorizedError, BadRequestError } from '@hursunss/common'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'

const router = express.Router()

router.put('/api/tickets/:id', requireAuth,
    [
        body('title').not().isEmpty().withMessage('title is required'),
        body('price').isFloat({gt: 0}).withMessage('price must be provided and must be greater than 0')
    ],
    ValidateRequest,
    async (req: Request, res: Response) => {
    const { id } = req.params
    
    const ticket = await Ticket.findById(id)
    
    if (!ticket) {
        throw new NotFoundError()
        }
        
        if (ticket.orderId) {
            throw new BadRequestError('cannot edit a reserved ticket')
        }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
        }
        
        ticket.set({
            title: req.body.title,
            price: req.body.price
        })
        
        await ticket.save()
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        res.send(ticket)
})

export {router as updateTicketRouter}