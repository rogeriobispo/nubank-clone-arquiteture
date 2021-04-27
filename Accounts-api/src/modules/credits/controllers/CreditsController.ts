import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IDebitDto from '../dto/IDebitDto';
import CreditAccountService from '../services/creditAccountService';

class CreditsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const accountID = req.params.id;

    const { amount, transactionID }: IDebitDto = req.body;

    const creditAccountService = container.resolve(CreditAccountService);
    const response = await creditAccountService.perform(
      amount,
      accountID,
      transactionID,
      req.currentUser
    );

    return res.json({ credit: response });
  }
}

export default new CreditsController();
