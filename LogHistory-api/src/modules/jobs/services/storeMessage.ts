import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IHistoryLogRepository from '../Repositories/IhistoryLogRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

@injectable()
class StoreMessage {
  constructor(
    @inject('MessageBroker')
    private messageBroker: IMessageBroker,
    @inject('HistoryLogRepository')
    private historyLogRepository: IHistoryLogRepository
  ) {}

  public perform(queue: string): () => void {
    return async () => {
      const messages = await this.messageBroker.consume(queue);
      messages.forEach(async (message) =>
        this.historyLogRepository.create(message)
      );
    };
  }
}

export default StoreMessage;
