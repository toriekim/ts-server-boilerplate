import { handleCors, handleBodyRequestParsing } from './common'
import { handleJSONBodyLimit, handleRateLimit } from './auth'

export default [
  handleCors,
  handleBodyRequestParsing,
  handleJSONBodyLimit,
  handleRateLimit
]
