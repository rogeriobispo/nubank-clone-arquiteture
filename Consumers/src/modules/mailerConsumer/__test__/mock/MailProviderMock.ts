import ISendMailDTO from '../../providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '../../providers/MailProvider/models/IMailProvider';
import IMailTemplateProviderMock from './MailTemplateProviderMock';

class MailProviderMock implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  constructor(private mailTemplateProvider: IMailTemplateProviderMock) {}

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default MailProviderMock;
