import express, { NextFunction, Request, Response, Router } from 'express'
import rateLimit from 'express-rate-limit'
import { HTTP401Error } from '../helpers/httpErrors'
import { UserRepository } from '../repositories/user.repository'

// --- Request Limit Middleware ---
export const handleRateLimit = (router: Router) => {
  const limit = rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 30 * 60 * 1000, // 30 mins, the timeframe for which requests are checked/remembered.
    message: 'Too many requests'
  })
  router.use(limit)
}

export const handleJSONBodyLimit = (router: Router) =>
  router.use(express.json({ limit: '10kb' })) // limit body to 10kb

// --- Auth Middleware ---
export const requireToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      throw new HTTP401Error('Bad token')
    }
    const user = UserRepository.findByToken(token)
    req.user = user
    next() // Go to the next piece of middleware
  } catch (err) {
    const error = new HTTP401Error('Bad token')
    next(error)
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('User is not an Admin!')
  } else {
    // If user IS an admin, pass them forward!
    next()
  }
}
