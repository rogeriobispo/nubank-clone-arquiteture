import cepPromise from 'cep-promise';
import ICepProvider, { CepResponse } from '../models/ICepProvider';

class CepPromiseProvider implements ICepProvider {
  async cep(postalCode: string): Promise<CepResponse> {
    return cepPromise(postalCode);
  }
}

export default CepPromiseProvider;
