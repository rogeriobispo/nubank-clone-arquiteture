import Account from '../typeorm/Entities/Account';
import ICreateUserDTO from '../dto/ICreateAccountDto';

interface IUserRepository {
  create(account: ICreateUserDTO): Promise<Account>;
  update(account: Account): Promise<Account>;
  findByUserId(userId: string): Promise<Account | undefined>;
  findById(id: string): Promise<Account | undefined>;
  findByAccountNumber(number: number): Promise<Account | undefined>;
  credit(accountID: string, amount: number): Promise<boolean>;
  debit(accountID: string, amount: number): Promise<boolean>;
}

export default IUserRepository;
