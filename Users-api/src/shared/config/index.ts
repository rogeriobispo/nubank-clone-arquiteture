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

const RabbitMQExchange = {
  userCreatedExchange: String(process.env.USER_CREATE_EXCHANGE),
  userUpdatedExchange: String(process.env.USER_UPDATE_EXCHANGE),
  userBlockedExchange: String(process.env.USER_BLOCKED_EXCHANGE),
  userUnBlockedExchange: String(process.env.USER_UNBLOCKED_EXCHANGE),
};

export { ServerConfigs, RabbitMQConfig, RabbitMQExchange };
