import { container } from 'tsyringe';

import ICepProvider from './CepProvider/models/ICepProvider';
import CepPromiseProvider from './CepProvider/implementations/CePromiseProvider';

container.registerSingleton<ICepProvider>('CepProvider', CepPromiseProvider);
