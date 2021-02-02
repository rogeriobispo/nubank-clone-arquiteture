import ErrorHandler from '../shared/errors/ErrorHandle';
import { ServerConfigs } from '../shared/config';
import app from './app';

app.use(ErrorHandler);

app.listen(ServerConfigs.port, () => {
  console.warn(
    `Listening on port ${ServerConfigs.port} env: ${ServerConfigs.env}`
  );
});
