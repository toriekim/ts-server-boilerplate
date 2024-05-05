import { Request, Response, NextFunction } from 'express'

export type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void

export type Route = {
  path: string
  method: string
  handler: Handler | Handler[]
}

export interface User {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  isAdmin: boolean
}

export interface UserUpdateOptions {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  isAdmin?: boolean
}
