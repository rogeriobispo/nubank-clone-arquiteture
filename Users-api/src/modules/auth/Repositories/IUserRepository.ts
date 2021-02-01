import User from '../typeorm/Entities/User';

interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}

export default IUserRepository;
