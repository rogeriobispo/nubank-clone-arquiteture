import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '../services/AuthenticateUserService';

class AuthenticateController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authService = container.resolve(AuthenticateUserService);

    const token = await authService.perform(email, password);

    return res.json(token);
  }
}

export default new AuthenticateController();
