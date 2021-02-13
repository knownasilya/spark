import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import * as argon from 'argon2';
import { BaseEntity } from '../common/base.entity';
import { Account } from '../accounts/account.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  passwordHash?: string;

  @Field(() => Account)
  @OneToOne(() => Account, {
    eager: true,
  })
  @JoinColumn()
  account: Account;

  @Column()
  @Field()
  accountId: string;

  async updatePasswordHash(password: string) {
    this.passwordHash = await argon.hash(password);
  }

  async comparePassword(password: string) {
    return await argon.verify(this.passwordHash, password);
  }
}
