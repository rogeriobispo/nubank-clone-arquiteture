import { Router } from 'express';
import CreditsController from '../controllers/CreditsController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';
import validateTransactions from '../../../shared/middlewares/validateTransactions';

const creditsRouter = Router();

creditsRouter.post(
  '/:id/credits',
  AuthorizedEndPoint,
  validateTransactions,
  CreditsController.create
);

export default creditsRouter;
