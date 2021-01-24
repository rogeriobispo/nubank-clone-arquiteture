import User from '../typeorm/Entities/User';
import ICreateUserDTO from '../dtos/IUserDTO'

interface IUserRepository {
  create(user: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
}

export default IUserRepository
