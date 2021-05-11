import { injectable, inject } from 'tsyringe';
import path from 'path';
import axios from 'axios';
import IMailSender from '@shared/container/providers/mailProvider/models/IMailSender';
import AppError from '../../../shared/errors/AppErrors';
import ITransactionRepository from '../Repositories/ITransactionRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import {
  RabbitMQExchange,
  EmailConfig,
  ExternalApi,
} from '../../../shared/config';
import Transaction from '../typeorm/Entities/Transactions';
import ICreateInternalTransactionDTO from '../dto/ICreateInternalTransactionDto';
import IUserDto from '../dto/IUserDto';

interface TransactionResponse {
  credit: Transaction;
  debit: Transaction;
}
@injectable()
class CreateInternalTransferService {
  constructor(
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionRepository,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker,
    @inject('RabbitMailerSender')
    private rabbitMailerSender: IMailSender
  ) {}

  public async perform(
    { originAccount, destinyAccount, amount }: ICreateInternalTransactionDTO,
    user: IUserDto
  ): Promise<TransactionResponse> {
    const debitTransaction = await this.transactionRepository.create({
      originAccount,
      destinyAccount,
      kind: 'internal',
      userId: user.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'D',
      amount,
    });

    const creditTransaction = await this.transactionRepository.create({
      originAccount,
      destinyAccount,
      kind: 'internal',
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
      RabbitMQExchange.internalPendingDebitCreditCreated,
      JSON.stringify(debitCreditTransactions)
    );

    return debitCreditTransactions;
  }
}

export default CreateInternalTransferService;
