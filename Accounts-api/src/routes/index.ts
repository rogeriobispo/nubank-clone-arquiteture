import { Router } from 'express';
import AccountsRoutes from '../modules/accounts/routes/AccountsRoutes';
import DebitsRoutes from '../modules/debits/routes/DebitsRoutes';

const routes = Router();
routes.use('/accounts', AccountsRoutes);
routes.use('/accounts', DebitsRoutes);

export default routes;
