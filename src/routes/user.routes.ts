import { NextFunction, Request, Response, Router } from 'express'
import { isAdmin, requireToken } from '../middlewares/auth'
import { AppDataSource } from '../configs/db'
import { User } from '../entities/User.entity'
import { HTTP403Error, HTTP404Error } from '../utils/httpError.util'
import logger from '../configs/logger'

const UserRepository = AppDataSource.getRepository(User)

const userRouter = Router()

// GET /api/users - Get All Users
userRouter.get(
  '/',
  requireToken,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserRepository.find({
        select: ['id', 'firstName', 'lastName', 'username', 'email', 'isAdmin']
      })
      res.status(200).send(users)
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/users/:id - Get User By Id
userRouter.get(
  '/:id',
  requireToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user: reqUser } = req
      const { id } = req.params

      if (reqUser.id !== id) {
        throw new HTTP403Error('User not authorized')
      }

      const user = await UserRepository.findOneBy({ id })
      if (!user) {
        throw new HTTP404Error('User not found')
      }
      res.status(200).send(user)
    } catch (err) {
      next(err)
    }
  }
)

// PUT /api/users/:id - Update User By Id
userRouter.put(
  '/:id',
  requireToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { user: reqUser } = req
      const { updateOptions } = req.body

      if (reqUser.id !== id) {
        throw new HTTP403Error('User not authorized')
      }

      const userToUpdate = await UserRepository.findOneBy({ id })
      if (!userToUpdate) {
        throw new HTTP404Error('User to update not found')
      }

      const updatedUser = await UserRepository.createQueryBuilder()
        .update(User, updateOptions)
        .where('id = :id', { id })
        .returning('id, firstName, lastName, username, email, isAdmin')
        .updateEntity(true)
        .execute()

      logger.info('User updated successfully: ', updatedUser.raw[0])

      res.status(200).send(updatedUser.raw[0])
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /api/users/:id - Delete User By Id
userRouter.delete(
  '/:id',
  requireToken,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { user: reqUser } = req

      if (reqUser.id !== id) {
        throw new HTTP403Error('User cannot delete themself')
      }

      const userToDelete = await UserRepository.findOneBy({ id })
      if (!userToDelete) {
        throw new HTTP404Error('User to update not found')
      }

      const deletedUser = await UserRepository.createQueryBuilder()
        .softDelete()
        .where('id = :id', { id })
        .execute()

      if (deletedUser.affected) {
        logger.info(`User with ID ${id} deleted successfully`)
      }
      res.send(204)
    } catch (err) {
      next(err)
    }
  }
)

export default userRouter
