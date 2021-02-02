import { Router } from 'express';
import UserRouter from '../modules/Users/routes/UserRoutes';
import AuthRouter from '../modules/auth/routes/AuthenticateRoutes';

const routes = Router();
routes.use('/users', UserRouter);
routes.use('/login', AuthRouter);
export default routes;
