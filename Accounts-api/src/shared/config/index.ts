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

const RabbitMQExchange = {
  accountCreated: String(process.env.ACCOUNT_API_ACCOUNT_CREATED),
};

const JwtConfig = {
  secret: String(process.env.JWT_SECRET),
  expireIn: Number(process.env.JWT_EXPIRE_TIME),
};

const DBConfig = {
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PWD),
  database: String(process.env.DB_DATABASE),
  entities: ['src/modules/**/typeorm/Entities/{*.ts,*.js}'],
  migrations: ['./src/database/migrations/{*.ts,*.js}'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};

const EmailConfig = {
  from: {
    name: process.env.FROM_NAME || 'Default Company',
    email: process.env.FROM_EMAIL || 'defaultCompany@campany.com',
  },
};
export {
  ServerConfigs,
  RabbitMQConfig,
  RabbitMQExchange,
  JwtConfig,
  DBConfig,
  EmailConfig,
};
