import { injectable, inject } from 'tsyringe';
import ITefRepository from '../Repositories/ITefRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQExchange } from '../../../shared/config';
import Tef from '../typeorm/Entities/Tef';
import ICreateTefDto from '../dto/ICreateTefDto';
import IUserDto from '../dto/IUserDto';

interface TransactionResponse {
  credit: Tef;
  debit: Tef;
}
@injectable()
class CreateTefService {
  constructor(
    @inject('TefRepository')
    private transactionRepository: ITefRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public async perform(
    { originAccount, destinyAccount, amount }: ICreateTefDto,
    user: IUserDto
  ): Promise<TransactionResponse> {
    const debitTransaction = await this.transactionRepository.create({
      originAccount,
      destinyAccount,
      kind: 'tef',
      userId: user.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'D',
      amount,
    });

    const creditTransaction = await this.transactionRepository.create({
      originAccount,
      destinyAccount,
      kind: 'tef',
      userId: user.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'C',
      amount,
    });

    const debitCreditTransactions = {
      debit: debitTransaction,
      credit: creditTransaction,
    };
    this.messageBroker.publish(
      RabbitMQExchange.tefPendingDebitCreditCreated,
      JSON.stringify(debitCreditTransactions)
    );

    return debitCreditTransactions;
  }
}

export default CreateTefService;
