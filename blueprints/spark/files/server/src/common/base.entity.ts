import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InterfaceType()
export abstract class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  updatedBy?: string;

  @BeforeInsert()
  beforeInsert() {
    this.createAt = new Date();
    this.updatedAt = this.createAt;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
