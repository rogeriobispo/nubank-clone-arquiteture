import cron from 'node-cron';
import { container } from 'tsyringe';
import { CronTab, RabbitMQQueue } from '../../../shared/config';

import SendMail from '../services/SendMailService';

const sendMail = container.resolve(SendMail);

const sendMailSchedule = cron.schedule(
  CronTab.cronSendMail,
  sendMail.perform(RabbitMQQueue.sendMailQueue),
  {
    scheduled: false,
  }
);

sendMailSchedule.start();
