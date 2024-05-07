import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { User } from '../../../entities/User.entity'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const userFactory = factoryManager.get(User)
    // save 5 factory generated entities, to the database
    await userFactory.saveMany(7)
  }
}
