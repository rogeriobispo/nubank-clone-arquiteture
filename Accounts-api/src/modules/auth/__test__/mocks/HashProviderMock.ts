import IHashProvider from '../../providers/HashProvider/models/IHashProvider';

class HashProviderMock implements IHashProvider {
  public async compareHash(passwd: string, hash: string): Promise<boolean> {
    return hash === passwd;
  }
}

export default HashProviderMock;
