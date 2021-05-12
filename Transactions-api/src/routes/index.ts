import { Router } from 'express';
import TefRoutes from '../modules/tef/routes/TefRoutes';

const routes = Router();
routes.use('/tefs', TefRoutes);

export default routes;
