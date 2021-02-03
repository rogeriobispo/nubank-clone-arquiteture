import { injectable, inject } from 'tsyringe';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQQueue } from '../../../shared/config';

@injectable()
class StoreMessage {
  constructor(
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  public perform(queue: string): () => void {
    return () => {
      console.log('Executando a tarefa a cada 1 minuto', queue);
    };
  }
}

export default StoreMessage;
