import { Router } from 'express';
import DebitsController from '../controllers/DebitsController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';
import validateTransactions from '../../../shared/middlewares/validateTransactions';

const debitsRouter = Router();

debitsRouter.post(
  '/:id/debits',
  AuthorizedEndPoint,
  validateTransactions,
  DebitsController.create
);

export default debitsRouter;
