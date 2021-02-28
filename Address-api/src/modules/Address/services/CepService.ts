import { injectable, inject } from 'tsyringe';
import ICacheProvider from '../../../shared/container/providers/cacheProvider/models/ICacheProvider';
import AppError from '../../../shared/errors/AppErrors';
import ICepProvider, {
  CepResponse,
} from '../providers/CepProvider/models/ICepProvider';

@injectable()
class CepService {
  constructor(
    @inject('CepProvider')
    private cepProvider: ICepProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async perform(postalCode: string): Promise<CepResponse> {
    const cacheKey = `address-${postalCode}`;
    let cep = await this.cacheProvider.recover<CepResponse>(cacheKey);

    if (!cep) cep = await this.cepProvider.cep(postalCode);

    if (!cep) throw new AppError('Cep Not Found', 404);

    await this.cacheProvider.save(cacheKey, cep);

    return cep;
  }
}

export default CepService;
