import { injectable, inject } from 'tsyringe';
import cep from 'cep-promise';
import { RabbitMQExchange } from '../../../shared/config';
import AppError from '../../../shared/errors/AppErrors';

import IMessageBroker from '../../../shared/container/providers/messageBrokerProvider/models/IMessageBrocker';
import ICepProvider, {
  CepResponse,
} from '../providers/CepProvider/models/ICepProvider';

@injectable()
class CepService {
  constructor(
    @inject('MessageBroker')
    private messageBroker: IMessageBroker,
    @inject('CepProvider')
    private cepProvider: ICepProvider
  ) {}

  public async perform(postalCode: string): Promise<CepResponse> {
    const response = await this.cepProvider.cep(postalCode);
    if (!response) throw new AppError('Cep Not Found', 404);
    return response;
  }
}

export default CepService;
