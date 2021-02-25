import * as dotenv from 'dotenv';
import path from 'path';

const envFile = !process.env.NODE_ENV
  ? `.env.development`
  : `.env.${process.env.NODE_ENV}`;

const file = path.join(__dirname, '..', 'env/', envFile);

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

export { ServerConfigs, RabbitMQConfig, RabbitMQExchange };
