import { Router } from 'express'
import { isAdmin, requireToken } from '../middlewares/auth'
import * as userController from '../controllers/user.controller'

const userRouter = Router()

/*
 * GET /api/users - Get All Users
 * Requires: JWT, Admin Role
 * Returns: Array of User objects
 * Error: 401 - Bad token
 * Error: 403 - User not authorized
 */
userRouter.get('/', requireToken, isAdmin, userController.get)

/*
 * GET /api/users/:id - Get User By Id
 * Requires: JWT, User ID
 * Returns: User object
 * Error: 401 - Bad token
 * Error: 404 - User not found
 * Error: 403 - User not authorized
 */
userRouter.get('/:id', requireToken, isAdmin, userController.getById)

/*
 * PUT /api/users/:id - Update User By Id
 * Requires: JWT, User ID, Update Options
 * Returns: Updated User object
 * Error: 401 - Bad token
 * Error: 404 - User not found
 */
userRouter.put('/:id', requireToken, userController.update)

/*
 * DELETE /api/users/:id - Delete User By Id
 * Requires: JWT, User ID
 * Returns: 204 - No Content
 * Error: 401 - Bad token
 * Error: 403 - User not authorized
 * Error: 404 - User not found
 */
userRouter.delete('/:id', requireToken, isAdmin, userController.remove)

export default userRouter
