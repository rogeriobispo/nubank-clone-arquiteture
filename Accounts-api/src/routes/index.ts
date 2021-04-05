import { Router } from 'express';
import AccountsRoutes from '../modules/accounts/routes/AccountsRoutes'

const routes = Router();
routes.use('/accounts', AccountsRoutes);

export default routes;
