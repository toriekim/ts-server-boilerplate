import { NextFunction, Request, Response } from 'express'
import { HTTP403Error } from '../utils/httpError.util'
import * as userService from '../services/user.service'

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAll()
    res.status(200).send({ data: users })
  } catch (err) {
    next(err)
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const user = await userService.getById(id)
    res.status(200).send({ data: user })
  } catch (err) {
    next(err)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { id: reqUserId } = req.user
    const { updateOptions } = req.body

    if (reqUserId !== id) {
      throw new HTTP403Error('User not authorized')
    }
    const updatedUser = await userService.update(id, updateOptions)
    res
      .status(200)
      .send({ user: updatedUser, message: 'User updated successfully' })
  } catch (err) {
    next(err)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { id: reqUserId } = req.user

    if (reqUserId === id) {
      throw new HTTP403Error('User cannot delete themself')
    }
    await userService.remove(id)
    res.status(204).send({ message: 'User deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export { get, getById, update, remove }
