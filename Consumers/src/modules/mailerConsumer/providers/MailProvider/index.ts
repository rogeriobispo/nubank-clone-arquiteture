import { container } from 'tsyringe';
import { MailerConfig } from '@shared/config';
import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementation/EtherealMailProvider';
import SESMailProvider from './implementation/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[MailerConfig.driver]
);
