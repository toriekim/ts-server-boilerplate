import 'reflect-metadata'
import { runSeeders } from 'typeorm-extension'
import { AppDataSource } from './data-source'
import logger from '../logger'

const seed = async () => {
  logger.info('********** Starting connection to Data Source... **********')
  await AppDataSource.initialize()
  logger.info('********** Data Source successfully initialized! **********')
  await runSeeders(AppDataSource)
  logger.info('********** Seeders successfully executed! **********')
  process.exit()
}

seed()
