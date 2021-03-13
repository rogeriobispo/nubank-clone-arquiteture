import IUserUpdateDTO from '@modules/Users/dtos/IUserUpdateDTO';
import { getRepository, Repository } from 'typeorm';

import IUserRepository from '../../Repositories/IUserRepository';
import IUserDTO from '../../dtos/IUserDTO';
import User from '../Entities/User';

class UsersRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.ormRepository.save(user);
    return updatedUser;
  }

  async create({ name, email, password }: IUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default UsersRepository;
