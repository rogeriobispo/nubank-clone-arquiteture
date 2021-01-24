import { getRepository, Repository } from 'typeorm';

import IUserRepository from '../../../Users/Repositories/IUserRepository'
import IUserDTO from '../../dtos/IUserDTO';
import User from '../Entities/User'


class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async create({ name, email, password }: IUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user;
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({ where: { email }});
    return user;
  }
}

export default UsersRepository;
