import { compare, hash } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(passwd: string): Promise<string> {
    return hash(passwd, 8);
  }

  compareHash(passwd: string, passwordHashed: string): Promise<boolean> {
    return compare(passwd, passwordHashed);
  }
}

export default BCryptHashProvider;
