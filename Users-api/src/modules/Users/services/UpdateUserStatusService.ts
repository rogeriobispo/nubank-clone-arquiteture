import { injectable, inject } from 'tsyringe';
import { RabbitMQExchange } from '../../../shared/config';
import IUsersRepository from '../Repositories/IUserRepository';
import AppError from '../../../shared/errors/AppErrors';
import User from '../typeorm/Entities/User';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

@injectable()
class UpdateUserStatusService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public async perform(id: string): Promise<User> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) throw new AppError('User not found');

    this.messageBroker.publish(
      existingUser.active
        ? RabbitMQExchange.userBlockedExchange
        : RabbitMQExchange.userUnBlockedExchange,
      JSON.stringify({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      })
    );

    existingUser.active = !existingUser.active;

    const user = await this.usersRepository.update(existingUser);

    return user;
  }
}

export default UpdateUserStatusService;
