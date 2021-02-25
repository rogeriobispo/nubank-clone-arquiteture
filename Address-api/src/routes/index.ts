import { Router } from 'express';

const routes = Router();
routes.use('/cep', UserRouter);
export default routes;
