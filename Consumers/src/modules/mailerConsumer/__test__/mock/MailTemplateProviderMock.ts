import IMailTemplateProvider from '../../providers/MailTemplateProvider/models/IMailTemplateProvider';

class MailTemplateProviderMock implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default MailTemplateProviderMock;
