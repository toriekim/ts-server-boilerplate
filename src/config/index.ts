import { initializeDB } from './data-source'

const initDependencies = async () => {
  await initializeDB()
}

export { initDependencies }
