import { injectable, inject } from 'tsyringe';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange } from '../../../shared/config';

import User from '../typeorm/Entities/User';
import IUserUpdateDTO from '../dtos/IUserUpdateDTO';
import IUsersRepository from '../Repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import AppError from '../../../shared/errors/AppErrors';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public async perform({
    name,
    email,
    password,
    id,
  }: IUserUpdateDTO): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) throw new AppError('User not found');

    const existingEmail =
      email && (await this.usersRepository.findByEmail(email));

    if (existingEmail) throw new AppError('Email already taken');
    const hashedPassword =
      password && (await this.hashProvider.generateHash(password));

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.password = hashedPassword || existingUser.password;

    const user = await this.usersRepository.update(existingUser);

    this.messageBroker.publish(
      RabbitMQExchange.userUpdatedExchange,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    );

    return user;
  }
}

export default UpdateUserService;
