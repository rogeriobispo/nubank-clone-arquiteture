import ErrorHandler from '../shared/errors/ErrorHandle';
import app from './app'

app.use(ErrorHandler);
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
