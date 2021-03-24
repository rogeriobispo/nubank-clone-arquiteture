import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailSender from '@shared/container/providers/mailProvider/models/IMailSender';
import AppError from '../../../shared/errors/AppErrors';
import IAccountRepository from '../Repositories/IAccountRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange, EmailConfig } from '../../../shared/config';
import Account from '../typeorm/Entities/Account';
import ICreateAccountDTO from '../dto/ICreateAccountDto';
import IUserDto from '../dto/IUserDto';

@injectable()
class CreateUserService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker,
    @inject('RabbitMailerSender')
    private rabbitMailerSender: IMailSender
  ) {}

  public async perform(
    accountData: ICreateAccountDTO,
    user: IUserDto
  ): Promise<Account> {
    if (
      accountData.personKind === 'juridical' &&
      (accountData.kind === 'savings' || accountData.kind === 'salary')
    )
      throw new AppError('Juridical cant create savings/salary accounts');

    const account = await this.accountsRepository.create(accountData);

    this.messageBroker.publish(
      RabbitMQExchange.accountCreated,
      JSON.stringify(account)
    );

    this.sendAccountCreatedEmail(user, account);

    return account;
  }

  private async sendAccountCreatedEmail(
    user: IUserDto,
    account: Account
  ): Promise<void> {
    const { from } = EmailConfig;

    const to = { name: user.name, email: user.email };
    const subject = 'Conta Criada';
    const template = path.resolve(
      __dirname,
      '..',
      'views',
      'accountCreated.hbs'
    );
    const variables = {
      name: user.name,
      company: from.name,
      kind: account.kind,
      number: account.accountNumber,
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
