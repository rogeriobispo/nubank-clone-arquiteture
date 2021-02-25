import 'reflect-metadata';
import CepPromiseMock from '../mocks/CepPromiseMock';
import AppError from '../../../../shared/errors/AppErrors';
import CepService from '../../services/CepService';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let messageBrokerMock: MessageBrokerMock;
let cepService: CepService;
let cepProvider: CepPromiseMock;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    messageBrokerMock = new MessageBrokerMock();
    cepProvider = new CepPromiseMock();
    cepService = new CepService(messageBrokerMock, cepProvider);
  });

  describe('perform', () => {
    it('should return a cep when it exists', async () => {
      const expectedResponse = {
        cep: '06814210',
        state: 'SP',
        city: 'São Paulo',
        street: 'Argentina',
        neighborhood: 'Sao Marcos',
      };
      const response = await cepService.perform('06814210');
      expect(response).toEqual(expectedResponse);
    });

    it('should throw an AppError when cep does not exists', async () => {
      await expect(cepService.perform('555')).rejects.toBeInstanceOf(AppError);
    });
  });
});
