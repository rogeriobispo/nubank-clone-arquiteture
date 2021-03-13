import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

class HashProviderMock implements IHashProvider {
  public async generateHash(passwd: string): Promise<string> {
    return `hashed:${passwd}`;
  }

  // public async compareHash(passwd: string, hash: string): Promise<boolean> {
  //   return `hashed:${passwd}` === hash;
  // }
}

export default HashProviderMock;
