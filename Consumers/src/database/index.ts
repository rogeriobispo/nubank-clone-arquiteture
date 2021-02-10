import mongoose from 'mongoose';
import { MongoDB } from '../shared/config';

mongoose.connect(MongoDB.connectionString, {
  useNewUrlParser: MongoDB.useNewUrlParser,
  useUnifiedTopology: MongoDB.useUnifiedTopology,
});
