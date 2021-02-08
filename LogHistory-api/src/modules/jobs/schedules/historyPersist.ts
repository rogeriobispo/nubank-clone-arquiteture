import cron from 'node-cron';
import { container } from 'tsyringe';
import { CronTab, RabbitMQQueue } from '../../../shared/config';

import StoreMessages from '../services/storeMessage';

const storeMessage = container.resolve(StoreMessages);
cron.schedule(
  CronTab.cronStoreMessage,
  storeMessage.perform(RabbitMQQueue.historyLogQueue)
);
