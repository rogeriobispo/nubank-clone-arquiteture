import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAccountService from '../services/createAccountService';
import ICreateAccountDTO from '../dto/ICreateAccountDto';

class AccountsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const accountToCreate: ICreateAccountDTO = req.body;
    const user = req.currentUser;

    const createAccountService = container.resolve(CreateAccountService);
    const account = await createAccountService.perform(accountToCreate, user);

    return res.json(account);
  }
}

export default new AccountsController();
