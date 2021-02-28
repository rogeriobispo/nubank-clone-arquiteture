import { Router } from 'express';
import UserRouter from '../modules/Users/routes/UserRoutes';
import AuthRouter from '../modules/auth/routes/AuthenticateRoutes';
import AuthorizedRouter from '../modules/auth/routes/AuthorizedRouter';

const routes = Router();
routes.use('/users', UserRouter);
routes.use('/login', AuthRouter);
routes.use('/authorized', AuthorizedRouter);
export default routes;
