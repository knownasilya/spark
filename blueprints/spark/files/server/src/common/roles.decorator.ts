import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../accounts/account.entity';

export const Roles = (...args: AccountRole[]) => SetMetadata('roles', args);
