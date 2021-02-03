import mongoose from 'mongoose';
import { MongoDB } from '../shared/config';

const conectionString = `mongodb://${MongoDB.user}:${MongoDB.password}@${MongoDB.host}:${MongoDB.port}/${MongoDB.database}`;
mongoose.connect(conectionString, {
  useNewUrlParser: MongoDB.useNewUrlParser,
  useUnifiedTopology: MongoDB.useUnifiedTopology,
});
