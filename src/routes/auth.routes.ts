import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const authRouter = Router()

/*
 * POST /api/auth/login - Login
 * Requires: User username (string) & password (string)
 * Returns: Auth boolean & JWT, or Error message
 */
authRouter.post('/login', authController.login)

/*
 * POST /api/auth/signup - Registration Route
 * Requires: First and last names, email, password, username, isAdmin
 * Returns: New User object, JWT, auth boolean
 */
authRouter.post('/signup', authController.signup)

/*
 * GET /api/auth/me - Authorization Route
 * Requires: JWT to fetch user details from db
 * Returns: User object
 */
authRouter.get('/me', authController.me)

export default authRouter
