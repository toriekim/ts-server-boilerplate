import { NextFunction, Request, Response, Router } from 'express'
import {
  HTTP403Error,
  HTTP404Error,
  HTTPClientError
} from '../utils/httpError.util'
import logger from '../configs/logger'

const handle404Error = (router: Router) => {
  router.use((req: Request, res: Response) => {
    throw new HTTP404Error('Method not found.')
  })
}

type ErrorWithCode = Error & { code?: string }

const handleClientError = (router: Router) => {
  router.use(
    (err: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
      if (err.code == 'EBADCSRFTOKEN') {
        err = new HTTP403Error()
      }
      if (err instanceof HTTPClientError) {
        const { message, statusCode } = err
        logger.warn({ message })
        res.status(statusCode).send(message)
      } else {
        next(err)
      }
    }
  )
}

const handleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).send('Internal Server Error')
    } else {
      console.error(`Error: ${err.message}`)
      res.status(500).send(err.stack)
    }
  })
}

export default [handle404Error, handleClientError, handleServerError]
