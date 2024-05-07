import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'
import logger from '../logger'

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // username: 'test',
  // password: 'test',
  database: 'boilerplate-test',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migration/*.{js,ts}'],
  seeds: ['src/configs/database/seeds/**/*{.ts,.js}'],
  factories: ['src/configs/database/factories/**/*{.ts,.js}'],
  subscribers: []
}

export const AppDataSource = new DataSource(options)

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
