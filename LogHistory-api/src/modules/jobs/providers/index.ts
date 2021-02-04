import { container } from 'tsyringe';

import IhistoryLogRepository from '../Repositories/IhistoryLogRepository';
import HistoryLogRepository from '../mongoose/repository/HistoryLogRepository';

container.registerSingleton<IhistoryLogRepository>(
  'HistoryLogRepository',
  HistoryLogRepository
);
