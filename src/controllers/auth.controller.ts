import { NextFunction, Request, Response, Router } from 'express'
import * as userService from '../services/user.service'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body
    const token = await userService.authenticate(username, password)
    res.status(200).send({ auth: true, token })
  } catch (err) {
    next(err)
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName, email, username, password, isAdmin } = req.body

    const { user, token } = await userService.create({
      firstName,
      lastName,
      email,
      username,
      password,
      isAdmin
    })

    res.status(201).send({
      user,
      token,
      message: 'User registered successfully'
    })
  } catch (err) {
    const error = err as Error
    if (error.message === 'User already exists') {
      res.status(401).send(error.message)
    } else {
      next(err)
    }
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization || ''
    const user = await userService.getMe(token)
    res.send(user)
  } catch (err) {
    next(err)
  }
}
