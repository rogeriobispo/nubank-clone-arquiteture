import dotenv from 'dotenv';
import path from 'path';

const file = path.join(__dirname, '..', 'env/', `.env.${process.env.NODE_ENV}`);

dotenv.config({
  path: file,
});

const ServerConfigs = {
  port: Number(process.env.PORT),
  env: process.env.NODE_ENV,
};

const RabbitMQConfig = {
  host: process.env.RABBIT_HOST,
  port: Number(process.env.RABBIT_PORT),
  vhost: process.env.RABBIT_VHOST,
  user: process.env.RABBIT_USER,
  pwd: process.env.RABBIT_PWD,
};

const RabbitMQExchange = {};
const RabbitMQQueue = {
  historyLogQueue: String(process.env.HISTORY_LOG_QUEUE),
  sendMailQueue: String(process.env.SEND_MAIL_QUEUE),
};

const CronTab = {
  cronStoreMessage: String(process.env.CRON_STORE_MESSAGE),
  cronSendMail: String(process.env.CRON_SEND_MAIL),
};

const MongoDB = {
  connectionString: String(process.env.MONGODB_CONNECTION_STRING),
  useNewUrlParser: Boolean(process.env.MONGODB_USE_NEW_URL_PARSER),
  useUnifiedTopology: Boolean(process.env.MONGODB_USE_UNIFIED_TOPOLOGY),
};

interface IMailConfig {
  driver: 'ethereal' | 'ses';
}

const MailerConfig = {
  driver: process.env.MAILER_DRIVER || 'ethereal',
} as IMailConfig;

export {
  ServerConfigs,
  RabbitMQConfig,
  RabbitMQExchange,
  CronTab,
  RabbitMQQueue,
  MongoDB,
  MailerConfig,
};
