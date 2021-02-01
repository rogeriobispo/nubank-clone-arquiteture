import { v4 as uuidv4 } from 'uuid';
import IUserDTO from './IUserDTO';
import User from '../../typeorm/Entities/User';
import IUserRepository from '../../Repositories/IUserRepository';

const users: User[] = [];
class UserRepositoryMock implements IUserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return users.filter((user) => user.email === email)[0];
  }

  async create(userParams: IUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuidv4(), ...userParams });

    users.push(user);

    return user;
  }
}

export default UserRepositoryMock;
