import { getRepository, Repository } from 'typeorm';
import IUserRepository from '../../Repositories/IUserRepository';
import User from '../Entities/User';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default UsersRepository;
