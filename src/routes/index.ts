import { Router } from 'express'
import userRouter from './user.routes'

const routes = Router()

routes.use('/auth', userRouter)

export default routes
