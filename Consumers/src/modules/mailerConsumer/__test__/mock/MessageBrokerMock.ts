import IMessageBroker, {
  IMessageObj,
} from '../../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import { RabbitMQQueue } from '../../../../shared/config';

const to = {
  name: 'jhondoe',
  email: 'jhondoe@gmail.com',
};

const from = {
  name: 'Pix department',
  email: 'donotresponde@bankexample.com',
};
const subject = 'Notification from bankexample.com';

const templateFileContent = '{{title}} - {{name}}';
const variables = {
  name: 'jhondoe',
  title: 'Mister',
};

class MessageBrokerMock implements IMessageBroker {
  messages = [
    {
      currentUserId: '100',
      eventName: 'SEND_MAIL_QUEUE',
      message: JSON.stringify({
        to,
        from,
        subject,
        templateFileContent,
        variables,
      }),
    },
  ];

  async consume(queue: string): Promise<IMessageObj[]> {
    if (queue !== RabbitMQQueue.sendMailQueue) return [];
    return this.messages;
  }
}

export default MessageBrokerMock;
