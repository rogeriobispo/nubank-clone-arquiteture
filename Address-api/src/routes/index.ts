import { Router } from 'express';
import CepRouter from '../modules/Address/routes/CepRoutes';
import ClearCacheRoutes from '../modules/Address/routes/ClearCacheRoutes';
import authorizedEndPoint from '../shared/middlewares/authorizedEndPoint';

const routes = Router();
routes.use('/cep', authorizedEndPoint, CepRouter);
routes.use('/clearcache', authorizedEndPoint, ClearCacheRoutes);
export default routes;
