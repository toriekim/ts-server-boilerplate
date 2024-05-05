import { NextFunction, Request, Response, Router } from 'express'
import { encrypt } from '../helpers/encrypt'
import { HTTP403Error, HTTP404Error } from '../helpers/httpErrors'
import { UserRepository } from '../repositories/user.repository'
import logger from '../config/logger'

const authRouter = Router()

/*
 * POST /api/auth/login - Login
 * Requires: User email (string) & password (string)
 * Returns: Auth boolean & JWT, or Error message
 */
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const token = await UserRepository.authenticate(email, password)

    res.status(200).send({ auth: true, token })
  } catch (err) {
    next(err)
  }
})

/*
 * POST /api/auth/signup - Registration Route
 * Requires: First and last names, email, password, username, isAdmin
 * Returns: New User object, JWT, auth boolean
 */
authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, username, password, isAdmin } = req.body

    const hashedPassword = await encrypt.hashPassword(password)

    const newUser = UserRepository.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      isAdmin
    })
    const createdUser = await UserRepository.save(newUser)
    logger.info('New user created: ', createdUser.id)

    const token = encrypt.generateToken({ id: newUser.id })

    res.status(201).send({ user: createdUser, auth: true, token })
  } catch (err) {
    const error = err as Error
    if (error.message === 'User already exists') {
      res.status(401).send(error.message)
    } else {
      next(err)
    }
  }
})

/*
 * GET /api/auth/me - Authorization Route
 * Requires: JWT to fetch user details from db
 * Returns: User object
 */
authRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization || ''
    const user = await UserRepository.findByToken(token)
    res.send(user)
  } catch (err) {
    next(err)
  }
})

export default authRouter
