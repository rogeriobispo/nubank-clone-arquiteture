// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata';
import { container } from 'tsyringe';
import RabbitMQ from './providers/messageBrokerProvider/implementations/rabbitMQ';
import IMessageBroker from './providers/messageBrokerProvider/models/IMessageBrocker';

import '../../modules/historylogConsumer/providers';

container.registerSingleton<IMessageBroker>('MessageBroker', RabbitMQ);
