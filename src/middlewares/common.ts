import { Router, urlencoded, json } from 'express'
import cors from 'cors'

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }))

export const handleBodyRequestParsing = (router: Router) => {
  router.use(urlencoded({ extended: true }))
  router.use(json())
}
