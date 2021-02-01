import { injectable, inject } from 'tsyringe';
import { RabbitMQExchange } from '../../../shared/config';
import AppError from '../../../shared/errors/AppErrors';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IwebTokenProvider from '../providers/WebTokenProvider/model/IwebTokenProvider';
import IUsersRepository from '../Repositories/IUserRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

interface Response {
  token: string;
}

@injectable()
class AuthenticateUserSerice {
  constructor(
    @inject('UsersAuthRepository')
    private usersRepository: IUsersRepository,
    @inject('HashAuthProvider')
    private hashProvider: IHashProvider,
    @inject('WebTokenProvider')
    private webTokenProvider: IwebTokenProvider,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public async perform(email: string, password: string): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Unauthorized', 401);

    const checkPassword = await this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!checkPassword) throw new AppError('Unauthorized', 401);

    this.messageBroker.publish(
      RabbitMQExchange.userAuthenticatedExchange,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    );

    const response = {
      token: await this.webTokenProvider.token({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };

    return response;
  }
}

export default AuthenticateUserSerice;
