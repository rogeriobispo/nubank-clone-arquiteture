import { container } from 'tsyringe';
import RabbitMQ from './providers/messageBrokerProvider/implementations/rabbitMQ';
import IMessageBroker from './providers/messageBrokerProvider/models/IMessageBrocker';
import '../../modules/Users/providers';

container.registerSingleton<IMessageBroker>('MessageBroker', RabbitMQ);
