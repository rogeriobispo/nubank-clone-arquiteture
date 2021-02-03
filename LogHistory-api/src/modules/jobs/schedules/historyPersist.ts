import cron from 'node-cron';
import { container } from 'tsyringe';

import { CronTab } from '../../../shared/config';
import StoreMessages from '../services/storeMessage';

const storeMessage = container.resolve(StoreMessages);
cron.schedule(CronTab.everySecond, storeMessage.perform('fila do alen'));
