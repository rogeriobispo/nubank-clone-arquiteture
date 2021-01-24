import express from 'express';
import 'express-async-errors';
import '../database';
import routes from '../routes'


import '../shared/container'

const app = express();

app.use(express.json());
app.use(routes)

export default app;
