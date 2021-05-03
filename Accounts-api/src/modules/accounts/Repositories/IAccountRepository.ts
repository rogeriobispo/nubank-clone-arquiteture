import Account from '../typeorm/Entities/Account';
import ICreateUserDTO from '../dto/ICreateAccountDto';

interface IUserRepository {
  create(account: ICreateUserDTO): Promise<Account>;
}

export default IUserRepository;
