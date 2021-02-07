import jwt from 'jsonwebtoken';
import { JwtConfig } from '../../../../shared/config';

interface TokenObj {
  id: string;
  name: string;
  email: string;
}

const { secret, expireIn } = JwtConfig;

async function token({ id, name, email }: TokenObj): Promise<string> {
  const jtwObject = {
    id,
    name,
    email,
  };

  return jwt.sign(jtwObject, secret, {
    expiresIn: expireIn,
  });
}

export default token;
