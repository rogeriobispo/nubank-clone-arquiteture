import dotenv from 'dotenv';


dotenv.config({
  path: `./env/.env.${process.env.NODE_ENV}`,
})

const ServerConfigs = {
  port: process.env.PORT,
  env:  process.env.NODE_ENV
}


const RabbitMQ = {
  host: 'x',
  port: 'y'
}


export {
  ServerConfigs,
  RabbitMQ
}
