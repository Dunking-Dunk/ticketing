import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listener/order-cancelled-listener'
import { OrderCreatedListener } from './events/listener/order-created-listener'

const start = async () => { 
    console.log('Starting...')
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY MUST BE DEFINED ')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Mongo uri MUST BE DEFINED ')
    }
    
    if (!process.env.NATS_URL) {
        throw new Error('nats url MUST BE DEFINED ')
    }
    
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('nats cluster id MUST BE DEFINED ')
    }
    
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('nats client id MUST BE DEFINED ')
    }
    
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID, process.env.NATS_URL)
             
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })

        process.on('SIGINT', () =>natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to mongodb')
    } catch (err) {
        console.error(err)
    }
}

app.listen(3000, () => {
    console.log('Listen on port 3000!!!!')
})


start()