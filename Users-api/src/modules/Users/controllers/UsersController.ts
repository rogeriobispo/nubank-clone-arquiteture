import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const createUser = container.resolve(CreateUserService);
    const user = await createUser.perform({ name, email, password });
    return res.json({
      name: user.name,
      email: user.email,
      active: user.active,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    const { id } = req.params;

    const updateUser = container.resolve(UpdateUserService);
    const user = await updateUser.perform({ name, email, password, id });
    return res.json({
      name: user.name,
      email: user.email,
      active: user.active,
    });
  }
}

export default new UsersController();
