import 'reflect-metadata'
import { DataSource } from 'typeorm'

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
    console.log('********** Starting connection to Data Source... **********')
    // Initialize db connection
    await AppDataSource.initialize()
    console.log('********** Data Source successfully initialized! **********')
    // Return db connection
    return AppDataSource
  } catch (error) {
    console.log('********** Error during Data Source initialization :( **********')
  }
}
