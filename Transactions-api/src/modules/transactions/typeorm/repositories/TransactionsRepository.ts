import { getRepository, Repository } from 'typeorm';
import ICreateTransactionsDTO from '../../dto/ICreateTransactionDto';

import ITransactionRepository from '../../Repositories/ITransactionRepository';
import Transaction from '../Entities/Transactions';

class TransactionRepository implements ITransactionRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  async create(transaction: ICreateTransactionsDTO): Promise<Transaction> {
    const transctionCreated = this.ormRepository.create(transaction);
    await this.ormRepository.save(transctionCreated);
    return transctionCreated;
  }
}

export default TransactionRepository;
