import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailSender from '@shared/container/providers/mailProvider/models/IMailSender';
import AppError from '../../../shared/errors/AppErrors';
import IAccountRepository from '../Repositories/IAccountRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange, EmailConfig } from '../../../shared/config';
import IUserDto from '../dto/IUserDto';

@injectable()
class DebitAccountService {
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
    transactionID: string,
    user: IUserDto
  ): Promise<boolean> {
    if (amount <= 0) throw new AppError('credit should be greater than 0');

    const result = await this.accountsRepository.debit(accountID, amount);

    if (!result) throw new AppError('Account not found');

    this.messageBroker.publish(
      RabbitMQExchange.debitAccount,
      JSON.stringify({ accountID, amount, transactionID, userID: user.id })
    );

    return result;
  }
}

export default DebitAccountService;
