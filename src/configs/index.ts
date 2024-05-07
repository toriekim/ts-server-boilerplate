import { initializeDB } from './database/data-source'

const initDependencies = async () => {
  await initializeDB()
}

export { initDependencies }
