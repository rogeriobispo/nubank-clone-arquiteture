import { injectable, inject } from 'tsyringe';
import IHistoryLogRepository from '../Repositories/IhistoryLogRepository';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQQueue } from '../../../shared/config';

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
      console.log('Executando a tarefa a cada 1 minuto', queue);
    };
  }
}

export default StoreMessage;
