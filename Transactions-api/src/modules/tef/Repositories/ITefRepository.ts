import Tef from '../typeorm/Entities/Tef';
import ICreateTransactionDTO from '../dto/ICreateTransactionDto';

interface ITefRepository {
  create(tef: ICreateTransactionDTO): Promise<Tef>;
}

export default ITefRepository;
