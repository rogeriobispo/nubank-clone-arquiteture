import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailSender from '@shared/container/providers/mailProvider/models/IMailSender';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange, EmailConfig } from '../../../shared/config';
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
    private messageBroker: IMessageBroker,
    @inject('RabbitMailerSender')
    private rabbitMailerSender: IMailSender
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
        currentUserId: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
      })
    );

    this.sendWelcomeEmail(user);

    return user;
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    const { from } = EmailConfig;

    const to = { name: user.name, email: user.email };
    const subject = 'Bem Vindo';
    const template = path.resolve(__dirname, '..', 'views', 'welcome.hbs');
    const variables = {
      name: user.name,
      company: from.name,
      companyEmail: from.email,
    };
    this.rabbitMailerSender.sendMail({
      from,
      template,
      to,
      subject,
      variables,
    });
  }
}

export default CreateUserService;
