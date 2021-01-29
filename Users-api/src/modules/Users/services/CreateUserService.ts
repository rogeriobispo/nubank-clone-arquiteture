import { injectable, inject } from 'tsyringe';

import User from '../typeorm/Entities/User';
import IUserDTO from '../dtos/IUserDTO';
import IUsersRepository from '../Repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import AppError from '../../../shared/errors/AppErrors';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async perform({ name, email, password }: IUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) throw new AppError('User email already registered');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
