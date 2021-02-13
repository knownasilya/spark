import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountRole } from './account.entity';
import { UpdateAdminInput } from './account.inputs';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>
  ) {}

  async findOne(id: string) {
    return this.accountRepo.findOne(id);
  }

  async findAllByRole(role: AccountRole) {
    return this.accountRepo.find({ role });
  }

  async findByIds(ids: string[]): Promise<Account[]> {
    return await this.accountRepo
      .createQueryBuilder('account')
      .where('account.id IN (:...accountIds)', { accountIds: ids })
      .getMany();
  }

  async updateAdmin(id: string, input: UpdateAdminInput) {
    const admin = await this.accountRepo.findOne(id);

    if (admin.role !== AccountRole.ADMIN) {
      throw new ApolloError(
        `Attempted to update admin, but id is associated with '${admin.role}'.`
      );
    }

    Object.assign(admin, input);

    await this.accountRepo.save(admin);

    return admin;
  }
}
