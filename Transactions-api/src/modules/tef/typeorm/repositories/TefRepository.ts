import { getRepository, Repository } from 'typeorm';
import ICreateTefDto from '../../dto/ICreateTefDto';

import ITransactionRepository from '../../Repositories/ITefRepository';
import Tef from '../Entities/Tef';

class TefRepository implements ITransactionRepository {
  private ormRepository: Repository<Tef>;

  constructor() {
    this.ormRepository = getRepository(Tef);
  }

  async create(tef: ICreateTefDto): Promise<Tef> {
    const transctionCreated = this.ormRepository.create(tef);
    await this.ormRepository.save(transctionCreated);
    return transctionCreated;
  }
}

export default TefRepository;
