import HistoryLog from '../entities/HistoryLog';
import IHistoryLogRepository, {
  ResponseDTO,
} from '../../Repositories/IhistoryLogRepository';
import IHistoryLogDTO from '../../dtos/IHistoryLogDTO';

class HistoryLogRepository implements IHistoryLogRepository {
  async create(data: IHistoryLogDTO): Promise<ResponseDTO> {
    const historyLog = await HistoryLog.create(data);
    return historyLog as ResponseDTO;
  }
}

export default HistoryLogRepository;
