import { Router } from 'express';
import UserRouter from '../modules/Users/routes/UserRoutes'

const routes = Router();
routes.use('/users', UserRouter)
export default routes;
