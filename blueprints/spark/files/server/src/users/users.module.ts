import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Admin, Viewer, Editor } from '../accounts/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Viewer, Editor, Admin])],
  providers: [UsersResolver, UsersService],
  exports: [UsersResolver, UsersService, TypeOrmModule],
})
export class UsersModule {}
