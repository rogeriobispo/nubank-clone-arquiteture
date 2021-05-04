import { injectable, inject } from 'tsyringe';
import fs from 'fs';
import { RabbitMQExchange } from '../../../../config';

import IMailSender, { MailerObj } from '../models/IMailSender';

interface IMessageBroker {
  publish(
    exchange: string,
    message: string,
    routingKey?: string
  ): Promise<boolean>;
}

@injectable()
class RabbitMailerSender implements IMailSender {
  constructor(
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  async sendMail({
    template,
    from,
    to,
    subject,
    variables,
  }: MailerObj): Promise<void> {
    const templateFileContent = await fs.promises.readFile(template, {
      encoding: 'utf-8',
    });

    this.messageBroker.publish(
      RabbitMQExchange.senderMailer,
      JSON.stringify({
        from,
        to,
        subject,
        templateFileContent,
        variables,
      })
    );
  }
}

export default RabbitMailerSender;
