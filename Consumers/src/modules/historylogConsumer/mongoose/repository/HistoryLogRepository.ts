import HistoryLog from '../entities/HistoryLog';
import IHistoryLogRepository from '../../Repositories/IhistoryLogRepository';
import IHistoryLogDTO from '../../dtos/IHistoryLogDTO';

class HistoryLogRepository implements IHistoryLogRepository {
  async create(data: IHistoryLogDTO): Promise<void> {
    await HistoryLog.create(data);
  }
}

export default HistoryLogRepository;
