import { injectable, inject } from 'tsyringe';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange } from '../../../shared/config';
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
    private hashProvider: IHashProvider,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
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

    this.messageBroker.publish(
      RabbitMQExchange.userCreatedExchange,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
      })
    );

    return user;
  }
}

export default CreateUserService;
