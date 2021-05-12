import { container } from 'tsyringe';

import ITefRepository from '../Repositories/ITefRepository';
import TefRepository from '../typeorm/repositories/TefRepository';

container.registerSingleton<ITefRepository>('TefRepository', TefRepository);
