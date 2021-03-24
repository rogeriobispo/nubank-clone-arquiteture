import IMailSender, {
  MailerObj,
} from '../../../../shared/container/providers/mailProvider/models/IMailSender';

import IMessageBroker from '../../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

class RabbitMailerSenderMock implements IMailSender {
  constructor(private messageBroker: IMessageBroker) {}

  async sendMail({
    from,
    to,
    subject,
    template,
    variables,
  }: MailerObj): Promise<void> {
    this.messageBroker.publish(
      'mailerQueue',
      JSON.stringify({
        from,
        to,
        subject,
        templateFileContent: template,
        variables,
      })
    );
  }
}

export default RabbitMailerSenderMock;
