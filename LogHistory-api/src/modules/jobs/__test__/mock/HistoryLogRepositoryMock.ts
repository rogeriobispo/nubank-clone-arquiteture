import IHistoryLogData from '../../dtos/IHistoryLogDTO';
import IHistoryLogRepository from '../../Repositories/IhistoryLogRepository';

class HistoryLogRepositoryMock implements IHistoryLogRepository {
  logHistory: IHistoryLogData[] = [];

  async create(data: IHistoryLogData): Promise<void> {
    this.logHistory.push(data);
  }
}

export default HistoryLogRepositoryMock;
