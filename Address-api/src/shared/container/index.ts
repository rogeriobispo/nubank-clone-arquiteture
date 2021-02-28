import { container } from 'tsyringe';

import RedisCacheProvider from './providers/cacheProvider/implementations/RedisCacheProvider';
import ICacheProvider from './providers/cacheProvider/models/ICacheProvider';

import '../../modules/Address/providers';

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider
);
