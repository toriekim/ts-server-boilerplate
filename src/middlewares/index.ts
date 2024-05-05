import { handleCors, handleBodyRequestParsing } from './common'
import { handleJSONBodyLimit, handleRateLimit } from './auth'
import { handleLogging } from './logging'

export default [
  handleCors,
  handleBodyRequestParsing,
  handleJSONBodyLimit,
  handleRateLimit,
  handleLogging
]
