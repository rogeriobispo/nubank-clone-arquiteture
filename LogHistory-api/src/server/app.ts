import express from 'express';
import 'express-async-errors';
import '../database';
import cors from 'cors';
import routes from '../routes';

import '../shared/container';

import '../modules/jobs/schedules';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
