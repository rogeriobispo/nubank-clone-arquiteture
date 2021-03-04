import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IMailProvider from '../providers/MailProvider/models/IMailProvider';
import { IMailContact } from '../providers/MailProvider/dtos/ISendMailDTO';
import { ITemplateVariables } from '../providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

@injectable()
class SendMailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  async perform(
    subject: string,
    to: IMailContact,
    from: IMailContact,
    templateFileContent: string,
    variables: ITemplateVariables
  ): Promise<void> {
    this.mailProvider.sendMail({
      to,
      from,
      subject,
      templateData: {
        templateFileContent,
        variables,
      },
    });
  }
}

export default SendMailService;
