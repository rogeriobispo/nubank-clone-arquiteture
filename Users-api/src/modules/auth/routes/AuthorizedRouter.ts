import { Router } from 'express';
import authorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';

const authorizedRouter = Router();

authorizedRouter.post('/', authorizedEndPoint, (req, res) => {
  res.send('ok');
});

export default authorizedRouter;
