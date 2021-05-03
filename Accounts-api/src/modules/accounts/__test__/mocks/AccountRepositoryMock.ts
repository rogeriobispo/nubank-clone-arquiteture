import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import Account from '../../typeorm/Entities/Account';
import IAccountRepository from '../../Repositories/IAccountRepository';

const accounts: Account[] = [];

class AccountsRepositoryMock implements IAccountRepository {
  async create(accountParams: ICreateAccountDTO): Promise<Account> {
    const account = new Account();

    Object.assign(account, { id: uuidv4(), ...accountParams, active: true });

    accounts.push(account);

    return account;
  }
}

export default AccountsRepositoryMock;
