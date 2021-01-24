import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import IUserRepository from '../Repositories/IUserRepository';
import UserRepository from '../typeorm/repositories/UserRepository';

container.registerSingleton<IUserRepository>(
  'UsersRepository', UserRepository
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

