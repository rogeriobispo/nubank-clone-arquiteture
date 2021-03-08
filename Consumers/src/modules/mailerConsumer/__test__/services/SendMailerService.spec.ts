import SendMailerService from '../../services/SendMailService';
import MailProviderMock from '../mock/MailProviderMock';
import MailTemplateProviderMock from '../mock/MailTemplateProviderMock';
import MessageBrokerMock from '../mock/MessageBrokerMock';
import { IMailContact } from '../../providers/MailProvider/dtos/ISendMailDTO';
import { ITemplateVariables } from '../../providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

let sendMailerService: SendMailerService;
let mailProviderMock: MailProviderMock;
let mailTemplateProviderMock: MailTemplateProviderMock;
let messageBrokerMock: MessageBrokerMock;

let from: IMailContact;
let to: IMailContact;
let subject: string;
let template: string;
let variables: ITemplateVariables;
describe('SendMailerService', () => {
  beforeEach(() => {
    mailTemplateProviderMock = new MailTemplateProviderMock();
    mailProviderMock = new MailProviderMock(mailTemplateProviderMock);
    messageBrokerMock = new MessageBrokerMock();
    sendMailerService = new SendMailerService(
      mailProviderMock,
      messageBrokerMock
    );

    from = {
      name: 'Pix department',
      email: 'donotresponde@bankexample.com',
    };

    to = {
      name: 'jhondoe',
      email: 'jhondoe@gmail.com',
    };

    subject = 'Notification from bankexample.com';
    template = '{{title}} - {{name}}';
    variables = {
      name: 'jhondoe',
      title: 'Mister',
    };
  });
  describe('#perform', () => {
    it('expect to call mail provider', async () => {
      const templateData = {
        templateFileContent: template,
        variables,
      };
      const mailProviderSpy = spyOn(mailProviderMock, 'sendMail');

      await sendMailerService.perform('SEND_MAIL_QUEUE')();
      expect(mailProviderSpy).toHaveBeenCalledWith({
        to,
        from,
        subject,
        templateData,
      });
    });
  });
});
