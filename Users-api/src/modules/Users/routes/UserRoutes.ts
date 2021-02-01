import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import UsersStatusController from '../controllers/UsersStatusController';
import AuthorizedEndPoint from '../../../shared/middlewares/authorizedEndPoint';

const userRouter = Router();

userRouter.post('/', UsersController.create);
userRouter.put('/:id', AuthorizedEndPoint, UsersController.update);
userRouter.post(
  '/:id/status',
  AuthorizedEndPoint,
  UsersStatusController.update
);
export default userRouter;
