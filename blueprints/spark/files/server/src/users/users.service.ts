import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { User } from './user.entity';
import { Admin, AccountRole, Editor, Viewer } from '../accounts/account.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Viewer)
    private readonly viewerRepo: Repository<Viewer>,
    @InjectRepository(Editor)
    private readonly editorRepo: Repository<Editor>,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepo
      .createQueryBuilder()
      .where('LOWER("email") = LOWER(:email)', { email })
      .getOne();
  }

  async findOneById(id: string): Promise<User | undefined> {
    return await this.userRepo.findOne(id);
  }

  async findOneByAccount(id: string): Promise<User | undefined> {
    return await this.userRepo.findOne({ accountId: id });
  }

  async findAllByRole(role: AccountRole): Promise<User[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.role = :role', { role })
      .getMany();
  }

  async create({
    email,
    name,
    password,
    role,
  }: {
    email: string;
    name: string;
    password: string;
    role?: AccountRole;
  }): Promise<User | undefined> {
    const existingUsers = await this.userRepo.find({ email });

    if (existingUsers.length) {
      throw new UserInputError(
        `Cannot create a user with the given email address`,
        { email }
      );
    }

    const user = this.userRepo.create({ email, name });
    await user.updatePasswordHash(password);

    try {
      // TODO: move this to account service
      if (role === AccountRole.EDITOR) {
        const account = this.editorRepo.create({ role });
        await this.editorRepo.save(account);
        user.account = account;
      } else if (role === AccountRole.VIEWER) {
        const account = this.viewerRepo.create({ role });
        await this.viewerRepo.save(account);
        user.account = account;
      } else if (role === AccountRole.ADMIN) {
        const account = this.adminRepo.create({ role });
        await this.adminRepo.save(account);
        user.account = account;
      }

      await this.userRepo.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).detail) {
          // Matches "Key (email)=(john@example.com) already exists."
          const result = (error as any).detail.match(
            /Key \((.*)\)=\((.*)\) already exists./
          );

          if (result) {
            const [_, field, value] = result;

            if (field !== 'email') {
              throw error;
            }
            throw new UserInputError(
              `Unable to create user with the provided email '${value}' since it's already in use.`,
              { [field]: value }
            );
          } else {
            throw error;
          }
        }
      } else {
        throw error;
      }
    }
    return user;
  }

  async changePassword(user: User, password: string) {
    if (!password) {
      throw new ApolloError(`Password cannot be a blank value`);
    }

    await user.updatePasswordHash(password);
    await this.userRepo.save(user);

    return user;
  }
}
