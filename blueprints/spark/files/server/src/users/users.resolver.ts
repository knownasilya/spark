import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccountRole } from '../accounts/account.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/current-user.decorator';
import { Roles } from '../common/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { ApolloError } from 'apollo-server-express';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async user(@Args('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  @Mutation(() => User)
  async registerUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string
  ) {
    const user = await this.usersService.create({
      email,
      name,
      password,
      role: AccountRole.ADMIN,
    });

    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.ADMIN)
  async inviteEditor(
    @CurrentUser() _currentUser: User,
    @Args('email') email: string,
    @Args('name') name: string
  ) {
    const user = await this.usersService.create({
      email,
      name,
      password: 'changeme',
      role: AccountRole.EDITOR,
    });

    // TODO: send invite email

    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() currentUser: User,
    @Args('password') password: string,
    @Args('passwordConfirm') passwordConfirm: string
  ) {
    if (password !== passwordConfirm) {
      throw new ApolloError('Password confirmation must match the password');
    }

    await this.usersService.changePassword(currentUser, password);

    return currentUser;
  }
}
