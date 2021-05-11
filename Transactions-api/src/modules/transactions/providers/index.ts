import { container } from 'tsyringe';

import ITransactionRepository from '../Repositories/ITransactionRepository';
import TransactionRepository from '../typeorm/repositories/TransactionsRepository';

container.registerSingleton<ITransactionRepository>(
  'TransactionsRepository',
  TransactionRepository
);
