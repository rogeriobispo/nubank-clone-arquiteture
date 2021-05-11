import Transaction from '../typeorm/Entities/Transactions';
import ICreateTransactionDTO from '../dto/ICreateTransactionDto';

interface ITransactionRepository {
  create(transaction: ICreateTransactionDTO): Promise<Transaction>;
}

export default ITransactionRepository;
