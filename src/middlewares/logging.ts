import { Router } from 'express'
import morgan from 'morgan'
import logger from '../config/logger'

const myStream = {
  write: (text: string) => logger.info(text)
}

const handleLogging = (router: Router) => {
  router.use(morgan('combined', { stream: myStream }))
}

export { handleLogging }
