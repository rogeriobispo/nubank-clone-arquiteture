import { Router } from 'express';
import UsersController from '../controllers/UsersController'
import UsersStatusController from '../controllers/UsersStatusController'

const userRouter = Router();

userRouter.post('/', UsersController.create)
userRouter.post('/:id', UsersController.update)
userRouter.post('/:id/status', UsersStatusController.update)
export default userRouter;
