import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm'
import { IsEmail } from 'class-validator'
import { Order } from './Order.entity'
import { encrypt } from '../helpers/encrypt'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ unique: true, nullable: false })
  username: string

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string

  @Column()
  password: string

  @Column({ default: false })
  isAdmin: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]

  // Entity Listeners (Hooks)
  @BeforeInsert()
  async hashPassword() {
    this.password = await encrypt.hashPassword(this.password)
  }
}
