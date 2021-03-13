const { DBConfig } = require('./src/shared/config');

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

console.log(`Runging migration on enviroment: ${process.env.NODE_ENV}`);

module.exports = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
  cli,
};
