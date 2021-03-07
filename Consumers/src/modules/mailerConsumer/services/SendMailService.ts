import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IMailProvider from '../providers/MailProvider/models/IMailProvider';
import { IMailContact } from '../providers/MailProvider/dtos/ISendMailDTO';
import { ITemplateVariables } from '../providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

interface IMailMessage {
  subject: string;
  to: IMailContact;
  from: IMailContact;
  templateFileContent: string;
  variables: ITemplateVariables;
}
@injectable()
class SendMailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('MessageBroker')
    private messageBroker: IMessageBroker
  ) {}

  perform(queue: string): () => void {
    return async () => {
      const messages = await this.messageBroker.consume(queue);
      messages.forEach(async ({ message }) => {
        const mailerMessage: IMailMessage = JSON.parse(message);
        const {
          to,
          from,
          subject,
          templateFileContent,
          variables,
        } = mailerMessage;
        this.mailProvider.sendMail({
          to,
          from,
          subject,
          templateData: {
            templateFileContent,
            variables,
          },
        });
      });
    };
  }
}

export default SendMailService;
