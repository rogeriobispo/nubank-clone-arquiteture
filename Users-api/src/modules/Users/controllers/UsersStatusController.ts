import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserStatusService from '../services/UpdateUserStatusService'

class UsersStatusController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateUserStatus = container.resolve(UpdateUserStatusService);
    const user = await updateUserStatus.perform(id);
    return res.json(user);
  }
}

export default new UsersStatusController();
