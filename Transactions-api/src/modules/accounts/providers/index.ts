import { container } from 'tsyringe';

import IAccountRepository from '../Repositories/IAccountRepository';
import AccountRepository from '../typeorm/repositories/AccountRepository';

container.registerSingleton<IAccountRepository>(
  'AccountsRepositoryCreate',
  AccountRepository
);
