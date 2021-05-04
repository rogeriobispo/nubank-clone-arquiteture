import { createConnection } from 'typeorm';
import { DBConfig } from '../shared/config';

const {
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
  cli,
} = DBConfig;

createConnection({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
  cli,
});
