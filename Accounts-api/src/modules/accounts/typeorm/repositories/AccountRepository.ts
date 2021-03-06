import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import { getRepository, Repository } from 'typeorm';

import IUserRepository from '../../Repositories/IAccountRepository';
import Account from '../Entities/Account';

class AccountRepository implements IUserRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  findByAccountNumber(number: number): Promise<Account | undefined> {
    return this.ormRepository.findOne({ where: { number } });
  }

  async create({
    kind,
    personKind,
    userId,
    address,
    balance,
    overdraft,
  }: ICreateAccountDTO): Promise<Account> {
    const accountCreated = this.ormRepository.create({
      kind,
      personKind,
      userId,
      address: JSON.stringify(address),
      balance,
      overdraft,
    });
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
