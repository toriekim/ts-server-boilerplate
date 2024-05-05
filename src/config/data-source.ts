import 'reflect-metadata'
import { DataSource } from 'typeorm'
import logger from './logger'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // username: 'test',
  // password: 'test',
  database: 'test',
  entities: ['dist/entities/*.js'],
  synchronize: true,
  logging: false,
  migrations: [__dirname + '/migration/*.ts'],
  subscribers: []
})

export const initializeDB = async () => {
  try {
    logger.info('********** Starting connection to Data Source... **********')
    // Initialize db connection
    await AppDataSource.initialize()
    logger.info('********** Data Source successfully initialized! **********')
    // Return db connection
    return AppDataSource
  } catch (error) {
    logger.info('********** Error during Data Source initialization :( **********')
  }
}
