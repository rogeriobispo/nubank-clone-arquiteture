import { Router } from 'express';
import CepController from '../controllers/CepController';

const cepRouter = Router();

cepRouter.get('/:cep', CepController.show);

export default cepRouter;
