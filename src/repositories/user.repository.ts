import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../configs/db'
import { User } from '../entities/User.entity'
import { encrypt } from '../utils/encrypt.util'
import { HTTP401Error, HTTP404Error } from '../utils/httpError.util'

const { JWT_SECRET = 'superbigsecret' } = process.env

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany()
  },

  async authenticate(username: string, password: string) {
    try {
      const user = await this.findOneBy({ username })
      if (!user || !encrypt.comparePassword(password, user.password)) {
        throw new HTTP401Error(`Incorrect username or password`)
      }
      return encrypt.generateToken({ id: user.id })
    } catch (err) {
      throw new HTTP401Error(`Could not authenticate`)
    }
  },

  async findByToken(token: string) {
    try {
      const { id } = jwt.verify(token, JWT_SECRET)
      const user = await this.findOneBy({ id })
      if (!user) {
        throw new HTTP404Error(`User not found by token`)
      }
      return user
    } catch (err) {
      throw new HTTP401Error(`Bad token`)
    }
  },

  async hasToken(token: string) {
    try {
      const { id } = jwt.verify(token, JWT_SECRET)
      const user = await this.findOneBy(id)
      return user
    } catch (err) {
      console.log(err)
    }
  }
})
