import Account from '../typeorm/Entities/Account';

interface IUserRepository {
  findById(id: string): Promise<Account | undefined>;
  debit(accountID: string, amount: number): Promise<boolean>;
}

export default IUserRepository;
