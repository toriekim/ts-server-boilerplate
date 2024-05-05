import { Router } from 'express'
import userRouter from './user.routes'
import authRouter from './auth.routes'

const routes = Router()

routes.use('/auth', authRouter)
routes.use('/users', userRouter)

export default routes
