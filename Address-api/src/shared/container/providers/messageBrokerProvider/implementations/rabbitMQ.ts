import Amqp from 'amqplib';
import { RabbitMQConfig } from '../../../../config';
import IMessageBroker from '../models/IMessageBrocker';

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

  async publish(
    exchange: string,
    message: string,
    routingKey = '*'
  ): Promise<boolean> {
    const channel = await this.getChannel();
    const content = Buffer.from(message);
    const response = channel.publish(exchange, routingKey, content);
    channel.close();
    return response;
  }

  private getChannel() {
    return this.connection
      .then((conn) => conn.createChannel())
      .then((channel) => channel);
  }
}

export default RabbitMQ;
