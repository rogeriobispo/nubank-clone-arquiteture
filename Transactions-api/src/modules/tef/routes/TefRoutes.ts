import { Router } from 'express';
import TransactionsController from '../controllers/TefController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';
import CreateTransaction from '../Validations/CreateTef';

const accountsRouter = Router();

accountsRouter.post(
  '/',
  AuthorizedEndPoint,
  CreateTransaction,
  TransactionsController.create
);

export default accountsRouter;
