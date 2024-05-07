import { setSeederFactory } from 'typeorm-extension'
import { User } from '../../../entities/User.entity'

export default setSeederFactory(User, (faker) => {
  const user = new User()
  user.firstName = faker.person.firstName()
  user.lastName = faker.person.lastName()
  user.username = faker.internet.userName()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  user.isAdmin = faker.datatype.boolean()

  return user
})
