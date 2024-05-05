import logger from '../configs/logger'
import { encrypt } from '../utils/encrypt.util'
import { HTTP404Error } from '../utils/httpError.util'
import { User } from '../entities/User.entity'
import { User as UserType, UserUpdateOptions } from '../types'
import { UserRepository } from '../repositories/user.repository'

export const authenticate = (username: string, password: string) => {
  return UserRepository.authenticate(username, password)
}

export const getMe = (token: string) => {
  return UserRepository.findByToken(token)
}

export const getAll = async () => {
  const users = await UserRepository.find({
    select: ['id', 'firstName', 'lastName', 'username', 'email', 'isAdmin']
  })
  if (!users.length) {
    throw new HTTP404Error('No users found')
  }
  return users
}

export const getById = async (id: string) => {
  const user = await UserRepository.findOneBy({ id })
  if (!user) {
    throw new HTTP404Error(`User with ID ${id} not found`)
  }
  return user
}

export const create = async (newUserInfo: UserType) => {
  const hashedPassword = await encrypt.hashPassword(newUserInfo.password)

  const createdUser = await UserRepository.createQueryBuilder()
    .insert()
    .into(User)
    .values({ ...newUserInfo, password: hashedPassword })
    .returning('id, firstName, lastName, username, email, isAdmin')
    .execute()

  logger.info('New user created: ', createdUser.raw[0].id)
  const token = encrypt.generateToken({ id: createdUser.raw[0].id })
  return { user: createdUser.raw[0], token }
}

export const update = async (id: string, updateOptions: UserUpdateOptions) => {
  const userToUpdate = UserRepository.findOneBy({ id })

  if (!userToUpdate) {
    throw new HTTP404Error('User to update not found')
  }

  const updatedUser = await UserRepository.createQueryBuilder()
    .update(User)
    .set(updateOptions)
    .where('id = :id', { id })
    .returning('id, firstName, lastName, username, email, isAdmin')
    .execute()

  logger.info('User updated successfully: ', updatedUser.raw[0].id)
  return updatedUser.raw[0]
}

export const remove = async (id: string) => {
  const userToDelete = await UserRepository.findOneBy({ id })

  if (!userToDelete) {
    throw new HTTP404Error('User to update not found')
  }

  const deletedUser = await UserRepository.createQueryBuilder()
    .softDelete()
    .where('id = :id', { id })
    .execute()

  if (!deletedUser.affected) {
    logger.info(`User with ID ${id} NOT deleted`)
    throw new HTTP404Error('User not deleted')
  }
  logger.info(`User with ID ${id} deleted successfully`)
  return deletedUser.affected
}
