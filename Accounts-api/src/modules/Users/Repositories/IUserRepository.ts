import User from '../typeorm/Entities/User';
import ICreateUserDTO from '../dtos/IUserDTO';

interface IUserRepository {
  create(user: ICreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}

export default IUserRepository;
