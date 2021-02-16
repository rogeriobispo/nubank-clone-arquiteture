import Amqp from 'amqplib';
import { RabbitMQConfig } from '../../../../config';
import IMessageBroker, { IMessageObj } from '../models/IMessageBrocker';

class RabbitMQ implements IMessageBroker {
  private connection;

  constructor() {
    this.connection = Amqp.connect({
      hostname: RabbitMQConfig.host,
      port: RabbitMQConfig.port,
      vhost: RabbitMQConfig.vhost,
      username: RabbitMQConfig.user,
      password: RabbitMQConfig.pwd,
    });
  }

  async consume(queue: string): Promise<IMessageObj[]> {
    const messages: IMessageObj[] = [];
    const channel = await this.getChannel();
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          const msgObj = {
            currentUserId: JSON.parse(message.content.toString()).currentUserId,
            eventName: message.fields.exchange,
            message: message.content.toString(),
          };
          messages.push(msgObj);
        }
      },
      { noAck: true }
    );

    channel.ackAll();
    channel.close();

    return messages;
  }

  private getChannel() {
    return this.connection
      .then((conn) => conn.createChannel())
      .then((channel) => channel);
  }
}

export default RabbitMQ;
