import { Router } from 'express';
import authorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';

const authorizedRouter = Router();

authorizedRouter.get('/', authorizedEndPoint, (req, res) => {
  res.send('ok');
});

export default authorizedRouter;
