import { Router } from 'express';
import authorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';

const authorizedRouter = Router();

authorizedRouter.get('/', authorizedEndPoint, (req, res) => {
  const { id, email, name } = req.currentUser
  res.json({id, email, name}).status(200);
});

export default authorizedRouter;
