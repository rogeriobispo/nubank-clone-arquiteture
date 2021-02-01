import { compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  compareHash(passwd: string, passwordHashed: string): Promise<boolean> {
    return compare(passwd, passwordHashed);
  }
}

export default BCryptHashProvider;
