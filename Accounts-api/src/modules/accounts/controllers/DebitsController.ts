import { Request, Response } from 'express';
import { container } from 'tsyringe';

class DebitsController {
  public async create(req: Request, res: Response): Promise<Response> {}
}

export default new DebitsController();
