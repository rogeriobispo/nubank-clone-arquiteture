import dotenv from 'dotenv';

dotenv.config({
  path: `./env/.env.${process.env.NODE_ENV}`,
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

export { ServerConfigs, RabbitMQConfig };
