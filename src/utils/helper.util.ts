import { Router } from 'express'
import { Route } from '../types'

type Wrapper = (router: Router) => void

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router)
  }
}

export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(router as any)[method](path, handler)
  }
}
