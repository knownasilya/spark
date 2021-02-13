import {
  Entity,
  Column,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';

export enum AccountRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

registerEnumType(AccountRole, {
  name: 'AccountRole',
});

@Entity()
@ObjectType()
@TableInheritance({ column: { type: 'enum', name: 'role' } })
export class Account extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  preferredName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field()
  @Column({
    type: 'enum',
    enum: AccountRole,
    default: AccountRole.VIEWER,
  })
  role: AccountRole;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.account)
  user: Promise<User>;
}

@ChildEntity(AccountRole.VIEWER)
@ObjectType()
export class Viewer extends Account {}

@ChildEntity(AccountRole.EDITOR)
@ObjectType()
export class Editor extends Account {}

@ChildEntity(AccountRole.ADMIN)
@ObjectType()
export class Admin extends Account {}
