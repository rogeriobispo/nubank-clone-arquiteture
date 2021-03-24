import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import { getRepository, Repository } from 'typeorm';

import IUserRepository from '../../Repositories/IAccountRepository';
import Account from '../Entities/Account';

class AccountRepository implements IUserRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  async create(account: ICreateAccountDTO): Promise<Account> {
    const accountCreated = this.ormRepository.create(account);
    await this.ormRepository.save(accountCreated);
    return accountCreated;
  }

  async update(account: Account): Promise<Account> {
    const updatedAccount = await this.ormRepository.save(account);
    return updatedAccount;
  }

  async findByUserId(userId: string): Promise<Account | undefined> {
    return this.ormRepository.findOne({ where: { userId } });
  }

  async findById(id: string): Promise<Account | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default AccountRepository;
