import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET = 'superbigsecret', SALT_ROUNDS = 10 } = process.env

// The encrypt class helps hash password, compare it for login, and generate a token
export class encrypt {
  static async hashPassword(password: string) {
    return bcrypt.hashSync(password, SALT_ROUNDS)
  }

  static comparePassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword)
  }

  static generateToken(payload: { id: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  }
}
