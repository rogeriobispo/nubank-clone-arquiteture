import jwt from 'jsonwebtoken';
import IWebTokenProvider from '../model/IwebTokenProvider';
import { JwtConfig } from '../../../../../shared/config';

interface TokenObj {
  id: string;
  name: string;
  email: string;
}

const { secret, expireIn } = JwtConfig;

class JsonWebTokenProvider implements IWebTokenProvider {
  async token({ id, name, email }: TokenObj): Promise<string> {
    const jtwObject = {
      id,
      name,
      email,
    };

    return jwt.sign(jtwObject, secret, {
      expiresIn: expireIn,
    });
  }
}

export default JsonWebTokenProvider;
