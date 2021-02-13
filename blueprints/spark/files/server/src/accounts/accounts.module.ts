import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Account } from './account.entity';
import { AccountsResolver, AdminsResolver } from './accounts.resolver';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), UsersModule],
  providers: [AccountsResolver, AdminsResolver, AccountsService],
  exports: [AccountsResolver, AdminsResolver, AccountsService],
})
export class AccountsModule {}
