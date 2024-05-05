import { initializeDB } from './db'

const initDependencies = async () => {
  await initializeDB()
}

export { initDependencies }
