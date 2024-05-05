import * as dotenv from 'dotenv'
import app from './server'
import { initDependencies } from './config'

dotenv.config()

const PORT = Number(process.env.PORT || 3000)

const init = async () => {
  // Connect to the database
  await initDependencies()

  // Start the server
  app.listen(PORT, () => console.log(`⚡️ Server is running http://localhost:${PORT}...`))
}

init()
