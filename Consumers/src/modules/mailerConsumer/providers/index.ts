import { container } from 'tsyringe';

import { MailerConfig } from '../../../shared/config';
import IMailProvider from './MailProvider/models/IMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from './MailTemplateProvider/implementation/HandleBarsMailTemplateProvider';

import EtherealMailProvider from './MailProvider/implementation/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementation/SESMailProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplateProvider
);

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[MailerConfig.driver]
);
