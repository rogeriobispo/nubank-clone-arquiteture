import AppError from '@shared/errors/AppErrors';
import ICepProvider, {
  CepResponse,
} from '../../providers/CepProvider/models/ICepProvider';

const addresses = [
  {
    cep: '06814210',
    state: 'SP',
    city: 'São Paulo',
    street: 'Argentina',
    neighborhood: 'Sao Marcos',
  },
  {
    cep: '05743200',
    state: 'SP',
    city: 'São Paulo',
    street: 'Nelson de souza campos',
    neighborhood: 'JD umarizal',
  },
];

class CepProviderMock implements ICepProvider {
  async cep(postalCode: string): Promise<CepResponse> {
    return addresses.filter((address) => address.cep === postalCode)[0];
  }
}

export default CepProviderMock;
