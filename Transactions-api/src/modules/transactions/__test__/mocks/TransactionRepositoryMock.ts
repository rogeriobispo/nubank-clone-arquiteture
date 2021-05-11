import { v4 as uuidv4 } from 'uuid';
import ICreateTransactionDTO from '../../dto/ICreateInternalTransactionDto';
import Transaction from '../../typeorm/Entities/Transactions';
import ITransactionRepository from '../../Repositories/ITransactionRepository';

const transactions: Transaction[] = [];

class TransactionsRepositoryMock implements ITransactionRepository {
  async create(transactionParans: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = new Transaction();

    Object.assign(transaction, {
      id: uuidv4(),
      ...transactionParans,
    });

    transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepositoryMock;
