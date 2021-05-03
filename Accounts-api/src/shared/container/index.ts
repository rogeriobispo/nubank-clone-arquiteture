import { container } from 'tsyringe';

import RabbitMQ from './providers/messageBrokerProvider/implementations/rabbitMQ';
import IMessageBroker from './providers/messageBrokerProvider/models/IMessageBrocker';
import IMailSender from './providers/mailProvider/models/IMailSender';
import RabbitMailerSender from './providers/mailProvider/implementations/rabbitMailerSender';

import '../../modules/accounts/providers';
import '../../modules/debits/providers';
import '../../modules/credits/providers';

container.registerSingleton<IMessageBroker>('MessageBroker', RabbitMQ);
container.registerSingleton<IMailSender>(
  'RabbitMailerSender',
  RabbitMailerSender
);
