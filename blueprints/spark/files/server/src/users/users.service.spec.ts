import { Test, TestingModule } from '@nestjs/testing';
import { AccountRole } from '../accounts/account.entity';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        UsersService,
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: mockRepository,
        // },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('creating a user should also include an account', async () => {
    const user = await service.create({
      name: 'Test',
      email: 'test@example.com',
      password: 'test',
      role: AccountRole.ADMIN,
    });
    expect(user.account.role).toEqual(AccountRole.ADMIN);
  });
});
