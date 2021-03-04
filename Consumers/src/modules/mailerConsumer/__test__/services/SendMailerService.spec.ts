import SendMailerService from '../../services/SendMailService';
import MailProviderMock from '../mock/MailProviderMock';
import MailTemplateProviderMock from '../mock/MailTemplateProviderMock';
import { IMailContact } from '../../providers/MailProvider/dtos/ISendMailDTO';
import { ITemplateVariables } from '../../providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

let sendMailerService: SendMailerService;
let mailProviderMock: MailProviderMock;
let mailTemplateProviderMock: MailTemplateProviderMock;
let from: IMailContact;
let to: IMailContact;
let subject: string;
let template: string;
let variables: ITemplateVariables;
describe('SendMailerService', () => {
  beforeEach(() => {
    mailTemplateProviderMock = new MailTemplateProviderMock();
    mailProviderMock = new MailProviderMock(mailTemplateProviderMock);
    sendMailerService = new SendMailerService(mailProviderMock);
    from = {
      name: 'Pix department',
      email: 'donotresponde@bankexample.com',
    };

    to = {
      name: 'jhondoe',
      email: 'jhondoe@gmail.com',
    };

    subject = 'Notification from bankexample.com';
    template = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          ola {{title}} {{name}} seja bem vindo 
        </body>
    </html>
    `;
    variables = {
      name: 'jhondoe',
      title: 'Mister',
    };
  });
  describe('#perform', () => {
    it('expect to call mail provider', async () => {
      const mailProviderSpy = spyOn(mailProviderMock, 'sendMail');
      const templateData = {
        templateFileContent: template,
        variables,
      };
      sendMailerService.perform(subject, to, from, template, variables);
      expect(mailProviderSpy).toHaveBeenCalledTimes(1);
      expect(mailProviderSpy).toHaveBeenCalledWith({
        to,
        from,
        subject,
        templateData,
      });
    });
  });
});
