import IHistoryLogDTO from '../dtos/IHistoryLogDTO';

interface IHistoryLogRepository {
  create(data: IHistoryLogDTO): Promise<void>;
}

export default IHistoryLogRepository;
