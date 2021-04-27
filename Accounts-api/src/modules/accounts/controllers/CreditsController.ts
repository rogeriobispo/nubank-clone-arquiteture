import { Request, Response } from 'express';
import { container } from 'tsyringe';

class CreditsController {
  public async create(req: Request, res: Response): Promise<Response> {}
}

export default new CreditsController();
