import { Router } from 'express';
import AuthenticateController from '../controllers/AuthenticateController';

const authRouter = Router();

authRouter.post('/', AuthenticateController.create);

export default authRouter;
