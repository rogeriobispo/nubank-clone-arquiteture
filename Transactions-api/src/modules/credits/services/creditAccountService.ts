import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/errors/AppErrors';
import IAccountRepository from '../Repositories/IAccountRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange } from '../../../shared/config';
import IUserDto from '../dto/IUserDto';

@injectable()
class CreditAccountService {
  constructor(
    @inject('CreditsAccountsRepository')
    private accountsRepository: IAccountRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public async perform(
    amount: number,
    accountID: string,
    transactionID: string,
    user: IUserDto
  ): Promise<boolean> {
    if (amount <= 0) throw new AppError('credit should be greater than 0');

    const account = await this.accountsRepository.findById(accountID);

    if (account && !account.active)
      throw new AppError('Account not found', 404);

    const result = await this.accountsRepository.credit(accountID, amount);

    if (!result) throw new AppError('Account not found', 404);

    this.messageBroker.publish(
      RabbitMQExchange.creditAccount,
      JSON.stringify({ accountID, amount, transactionID, userID: user.id })
    );

    return result;
  }
}

export default CreditAccountService;
