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
const RabbitMQQueue = {};

const CronTab = {
  everyMinute: String(process.env.CRON_EVERY_MINUTE),
  everySecond: String(process.env.CRON_EVERY_SECOND),
};

const MongoDB = {
  host: String(process.env.MONGODB_HOST),
  port: Number(process.env.MONGODB_PORT),
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
  database: String(process.env.MONGODB_DATABASE),
  useNewUrlParser: Boolean(process.env.MONGODB_USE_NEW_URL_PARSER),
  useUnifiedTopology: Boolean(process.env.MONGODB_USE_UNIFIED_TOPOLOGY),
};
export {
  ServerConfigs,
  RabbitMQConfig,
  RabbitMQExchange,
  CronTab,
  RabbitMQQueue,
  MongoDB,
};
