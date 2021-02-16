import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserStatusService from '../services/UpdateUserStatusService';

class UsersStatusController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const currentUserId = req.currentUser.id;
    const updateUserStatus = container.resolve(UpdateUserStatusService);
    const user = await updateUserStatus.perform(id, currentUserId);
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
    });
  }
}

export default new UsersStatusController();
