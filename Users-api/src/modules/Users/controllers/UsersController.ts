import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../services/CreateUserService'

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {name, email, password } = req.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.perform({ name, email, password });
    return res.json(user);
  }
}

export default new UsersController();
