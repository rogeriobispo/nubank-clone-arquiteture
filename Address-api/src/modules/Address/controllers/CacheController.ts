import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ClearCepsService from '../services/ClearCepsService';

class CacheController {
  public async destroy(req: Request, res: Response): Promise<Response> {
    const { ceps } = req.body;

    const clearCepsService = container.resolve(ClearCepsService);

    await clearCepsService.perform(ceps);

    return res.json();
  }
}

export default new CacheController();
