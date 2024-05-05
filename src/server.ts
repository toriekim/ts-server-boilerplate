import express, { Request, Response } from 'express'
import { applyMiddleware } from './helpers'
import routes from './routes'
import middlewares from './middlewares'
import errorHandlers from './middlewares/errorHandlers'

// Initialize express
const app = express()

// Add middlewares
applyMiddleware(middlewares, app)

// Add API routes
app.use('/api', routes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world! :D')
})

// Add error handlers
applyMiddleware(errorHandlers, app)

export default app
