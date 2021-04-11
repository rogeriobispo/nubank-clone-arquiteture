import { Router } from 'express';
import AccountsController from '../controllers/AccountsController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';
import CreateAccountValidations from '../Validations/CreateAccount';

const accountsRouter = Router();

accountsRouter.post(
  '/',
  AuthorizedEndPoint,
  CreateAccountValidations,
  AccountsController.create
);

export default accountsRouter;
