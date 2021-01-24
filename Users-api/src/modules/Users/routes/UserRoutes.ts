import { Router } from 'express';
import UsersController from '../controllers/UsersController'

const userRouter = Router();

userRouter.post('/', UsersController.create)
userRouter.post('/:id', UsersController.update)
export default userRouter;
