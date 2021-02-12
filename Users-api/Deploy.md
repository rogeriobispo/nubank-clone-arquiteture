# deploy steps
## 1 - yarn  build
## 2 - copy build package.json and ormconfig.json to server
## 3 - rename ormconfig.json.sample to ormconfig.json and edit ormconfig.json with database creditials 
## 4 - on src/shared/env rename .env.sample to .env.production or any enviroment edit var to the enviroment
## 5 - run ./node_modules/typeorm/cli.js "migration:run" to run pending migrations
## 6 - run server with node src/server/server.js          
