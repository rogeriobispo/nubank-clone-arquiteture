import { Document } from 'mongoose';
import IHistoryLogDTO from '../dtos/IHistoryLogDTO';

interface ResponseDTO extends Document {
  _id: string;
  eventName: string;
  userId: string;
  message: never;
  __v: number;
}

interface IHistoryLogRepository {
  create(data: IHistoryLogDTO): Promise<ResponseDTO>;
}

export { ResponseDTO };
export default IHistoryLogRepository;
