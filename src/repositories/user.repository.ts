import * as jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source'
import { User } from '../entities/User.entity'
import { encrypt } from '../helpers/encrypt'
import { HTTP401Error, HTTP404Error } from '../helpers/httpErrors'

const JWT_KEY = process.env.JWT_SECRET || 'superbigsecret'

export const UserRepository = AppDataSource.getRepository(User).extend({
  findById(id: string) {
    return this.findOneBy({ id })
  },

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
      const { id } = jwt.verify(token, JWT_KEY)
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
      const { id } = jwt.verify(token, JWT_KEY)
      const user = await this.findOneBy(id)
      return user
    } catch (err) {
      console.log(err)
    }
  }
})
