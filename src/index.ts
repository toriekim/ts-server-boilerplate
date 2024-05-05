import * as dotenv from 'dotenv'
import app from './server'
import { initDependencies } from './configs'
import logger from './configs/logger'

dotenv.config()

const PORT = Number(process.env.PORT || 3000)

const init = async () => {
  // Connect to the database
  await initDependencies()

  // Start the server
  app.listen(PORT, () =>
    logger.info({
      message: `⚡️ Server is running http://localhost:${PORT}...`
    })
  )
}

init()
