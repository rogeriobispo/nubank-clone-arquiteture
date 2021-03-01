import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CepService from '../services/CepService';

class CepController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { cep } = req.params;

    const cepService = container.resolve(CepService);

    const responseCep = await cepService.perform(cep);

    return res.json(responseCep);
  }
}

export default new CepController();
