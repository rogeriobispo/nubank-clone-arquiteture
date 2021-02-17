import IMessageBroker, {
  IMessageObj,
} from '../../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQQueue } from '../../../../shared/config';

class MessageBrokerMock implements IMessageBroker {
  messages = [
    {
      currentUserId: '100',
      eventName: 'USER_API_USER_CREATED',
      message: '1 message',
    },
    {
      currentUserId: '100',
      eventName: 'USER_API_USER_UPDATED',
      message: '2 message',
    },
    {
      currentUserId: '100',
      eventName: 'USER_API_USER_BLOCKED',
      message: '3 message',
    },
    {
      currentUserId: '100',
      eventName: 'USER_API_USER_UNBLOCKED',
      message: '4 message',
    },
    {
      currentUserId: '100',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '5 message',
    },
    {
      currentUserId: '105',
      eventName: 'USER_API_USER_CREATED',
      message: '6 message',
    },
    {
      currentUserId: '106',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '7 message',
    },
    {
      currentUserId: '107',
      eventName: 'USER_API_USER_CREATED',
      message: '8 message',
    },
    {
      currentUserId: '108',
      eventName: 'USER_API_USER_BLOCKED',
      message: '9 message',
    },
    {
      currentUserId: '109',
      eventName: 'USER_API_USER_AUTHENTICATED',
      message: '10 message',
    },
    {
      currentUserId: '110',
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
