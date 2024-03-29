import express from 'express'
import 'express-async-errors'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@hursunss/common'
import { indexOrderRouter } from './routes/index'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'

const app = express()

app.set('trust proxy', true)
app.use(bodyParser.json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(newOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)


app.all('*', async() => {
    throw new NotFoundError()
})
app.use(errorHandler)

export {app}