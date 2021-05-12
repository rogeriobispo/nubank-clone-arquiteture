import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTefService from '../services/CreateTefService';

class TefController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { originAccount, destinyAccount, amount } = req.body;
    const user = req.currentUser;
    const transactionTef = {
      originAccount,
      destinyAccount,
      amount,
    };
    const createTefService = container.resolve(CreateTefService);
    await createTefService.perform(transactionTef, user);

    return res.status(202).send();
  }
}

export default new TefController();
