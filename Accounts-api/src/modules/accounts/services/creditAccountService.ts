import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailSender from '@shared/container/providers/mailProvider/models/IMailSender';
import AppError from '../../../shared/errors/AppErrors';
import IAccountRepository from '../Repositories/IAccountRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange, EmailConfig } from '../../../shared/config';
import Account from '../typeorm/Entities/Account';
import IUserDto from '../dto/IUserDto';

@injectable()
class CreditAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker,
    @inject('RabbitMailerSender')
    private rabbitMailerSender: IMailSender
  ) {}

  public async perform(
    amount: number,
    accountID: string,
    user: IUserDto
  ): Promise<boolean> {
    if (amount <= 0) throw new AppError('credit should be greater than 0');

    const result = await this.accountsRepository.credit(accountID, amount);

    if (result) {
      this.messageBroker.publish(
        RabbitMQExchange.creditAccount,
        JSON.stringify({ accountID, amount })
      );

      this.sendAccountCreditEmail(user, accountID, amount);
    }

    return result;
  }

  private async sendAccountCreditEmail(
    user: IUserDto,
    accountID: string,
    amount: number
  ): Promise<void> {
    const account = await this.accountsRepository.findById(accountID);

    if (!account) return;

    const { from } = EmailConfig;

    const to = { name: user.name, email: user.email };
    const subject = 'Credito em conta';
    const template = path.resolve(
      __dirname,
      '..',
      'views',
      'accountCredit.hbs'
    );
    const variables = {
      name: user.name,
      company: from.name,
      amount,
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

export default CreditAccountService;
