import { Router } from 'express';
import AccountsRoutes from '../modules/accounts/routes/AccountsRoutes';
import DebitsRoutes from '../modules/debits/routes/DebitsRoutes';
import CreditsRoutes from '../modules/credits/routes/CreditsRoutes';

const routes = Router();
routes.use('/accounts', AccountsRoutes);
routes.use('/accounts', DebitsRoutes);
routes.use('/accounts', CreditsRoutes);

export default routes;
