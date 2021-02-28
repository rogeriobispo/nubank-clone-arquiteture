import { Router } from 'express';
import CepRouter from '../modules/Address/routes/CepRoutes';
import authorizedEndPoint from '../shared/middlewares/authorizedEndPoint';

const routes = Router();
routes.use('/cep', authorizedEndPoint, CepRouter);
export default routes;
