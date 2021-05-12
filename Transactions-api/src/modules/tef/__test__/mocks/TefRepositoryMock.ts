import { v4 as uuidv4 } from 'uuid';
import ICreateTefDto from '../../dto/ICreateTefDto';
import Tef from '../../typeorm/Entities/Tef';
import ITefRepository from '../../Repositories/ITefRepository';

const tefs: Tef[] = [];

class TefRepositoryMock implements ITefRepository {
  async create(tefParans: ICreateTefDto): Promise<Tef> {
    const tef = new Tef();

    Object.assign(tef, {
      id: uuidv4(),
      ...tefParans,
    });

    tefs.push(tef);

    return tef;
  }
}

export default TefRepositoryMock;
