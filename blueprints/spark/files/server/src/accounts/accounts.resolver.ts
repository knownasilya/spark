import {
  Resolver,
  Query,
  Args,
  Parent,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Account, AccountRole, Admin } from '../accounts/account.entity';
import { CurrentUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { AccountsService } from './accounts.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UpdateAdminInput } from './account.inputs';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService
  ) {}

  @Query(() => [Account])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.ADMIN)
  async accounts(
    @CurrentUser() currentUser: User,
    @Args('role') role: AccountRole
  ) {
    return await this.accountsService.findAllByRole(role);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() account: Account): Promise<User> {
    const { id } = account;
    return await this.usersService.findOneByAccount(id);
  }

  @ResolveField(() => String)
  async name(@Parent() account: Account): Promise<string> {
    return account.preferredName || (await this.user(account)).name;
  }
}

@Resolver(() => Admin)
export class AdminsResolver {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService
  ) {}

  @Query(() => [Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.ADMIN)
  async admins(@CurrentUser() currentUser: User) {
    return await this.accountsService.findAllByRole(AccountRole.ADMIN);
  }

  @Mutation(() => Admin)
  @Roles(AccountRole.ADMIN)
  async updateAdmin(
    @CurrentUser() _user: User,
    @Args('id') id: string,
    @Args('input', { type: () => UpdateAdminInput }) input: UpdateAdminInput
  ) {
    return await this.accountsService.updateAdmin(id, input);
  }
}
