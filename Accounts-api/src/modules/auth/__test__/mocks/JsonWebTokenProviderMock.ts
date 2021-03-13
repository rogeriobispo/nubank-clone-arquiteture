import IWebTokenProvider from '../../providers/WebTokenProvider/model/IwebTokenProvider';

interface TokenObj {
  id: string;
  name: string;
  email: string;
}
class JsonWebTokenProviderMock implements IWebTokenProvider {
  async token({ id, name, email }: TokenObj): Promise<string> {
    return `${id}, ${name}, ${email}:token`;
  }
}

export default JsonWebTokenProviderMock;
