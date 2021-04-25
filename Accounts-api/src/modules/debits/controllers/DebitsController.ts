import { Request, Response } from 'express';
import { container } from 'tsyringe';

import IDebitDto from '../dto/IDebitDto';
import DebitAccountService from '../services/debitAccountService';

class DebitsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const accountID = req.params.id;

    const { amount, transactionID }: IDebitDto = req.body;

    const debitAccountService = container.resolve(DebitAccountService);
    const response = await debitAccountService.perform(
      amount,
      accountID,
      transactionID,
      req.currentUser
    );

    return res.json({ debit: response });
  }
}

export default new DebitsController();
