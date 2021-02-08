import IMessageBroker, {
  IMessageObj,
} from '../../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQQueue } from '../../../../shared/config';

class MessageBrokerMock implements IMessageBroker {
  messages = [
    { userId: '100', eventName: 'USER_API_USER_CREATED', message: '1 message' },
    { userId: '100', eventName: 'USER_API_USER_UPDATED', message: '2 message' },
    { userId: '100', eventName: 'USER_API_USER_BLOCKED', message: '3 message' },
    {
      userId: '100',
      eventName: 'USER_API_USER_UNBLOCKED',
      message: '4 message',
    },
    {
      userId: '100',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '5 message',
    },
    { userId: '105', eventName: 'USER_API_USER_CREATED', message: '6 message' },
    {
      userId: '106',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '7 message',
    },
    { userId: '107', eventName: 'USER_API_USER_CREATED', message: '8 message' },
    { userId: '108', eventName: 'USER_API_USER_BLOCKED', message: '9 message' },
    {
      userId: '109',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '10 message',
    },
    {
      userId: '110',
      eventName: 'USER_API_USER_BLOCKED',
      message: '11 message',
    },
  ];

  async consume(queue: string): Promise<IMessageObj[]> {
    if (queue !== RabbitMQQueue.historyLogQueue) return [];
    return this.messages;
  }
}

export default MessageBrokerMock;
