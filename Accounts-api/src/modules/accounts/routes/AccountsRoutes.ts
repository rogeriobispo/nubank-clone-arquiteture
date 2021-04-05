import { Router } from 'express';
import AccountsController from '../controllers/AccountsController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';

const accountsRouter = Router();

accountsRouter.post('/', AuthorizedEndPoint, AccountsController.create);

export default accountsRouter;
