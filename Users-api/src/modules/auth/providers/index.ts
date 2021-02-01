import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import IUserRepository from '../Repositories/IUserRepository';
import UserRepository from '../typeorm/repositories/UserRepository';

import IWebTokenProvider from './WebTokenProvider/model/IwebTokenProvider';
import JsonWebTokenProvider from './WebTokenProvider/implementations/JsonWebTokenProvider';

container.registerSingleton<IUserRepository>(
  'UsersAuthRepository',
  UserRepository
);

container.registerSingleton<IHashProvider>(
  'HashAuthProvider',
  BCryptHashProvider
);

container.registerSingleton<IWebTokenProvider>(
  'WebTokenProvider',
  JsonWebTokenProvider
);
