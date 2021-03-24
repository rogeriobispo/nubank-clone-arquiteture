import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import Account from '../../typeorm/Entities/Account';
import IAccountRepository from '../../Repositories/IAccountRepository';

const accounts: Account[] = [];

class UserRepositoryMock implements IAccountRepository {
  async create(accountParams: ICreateAccountDTO): Promise<Account> {
    const account = new Account();

    Object.assign(account, { id: uuidv4(), ...accountParams, active: true });

    accounts.push(account);

    return account;
  }

  async update(account: Account): Promise<Account> {
    const index = accounts.findIndex(
      (accountDB) => accountDB.id === account.id
    );
    accounts.splice(index, 1, account);
    return accounts[index];
  }

  async findByUserId(userId: string): Promise<Account | undefined> {
    return accounts.filter((account) => account.userId === userId)[0];
  }

  async findById(id: string): Promise<Account | undefined> {
    return accounts.filter((account) => account.id === id)[0];
  }

  async findByAccountNumber(number: number): Promise<Account | undefined> {
    return accounts.filter((account) => account.accountNumber === number)[0];
  }
}

export default UserRepositoryMock;
