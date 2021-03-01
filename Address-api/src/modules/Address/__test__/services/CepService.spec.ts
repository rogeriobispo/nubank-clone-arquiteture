import 'reflect-metadata';
import CepPromiseMock from '../mocks/CepPromiseMock';
import AppError from '../../../../shared/errors/AppErrors';
import CepService from '../../services/CepService';
import CacheProviderMock from '../mocks/CacheProviderMock';

let cepService: CepService;
let cepProvider: CepPromiseMock;
let cacheProviderMock: CacheProviderMock;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    cepProvider = new CepPromiseMock();
    cacheProviderMock = new CacheProviderMock();
    cepService = new CepService(cepProvider, cacheProviderMock);
  });

  describe('#perform', () => {
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

    it('should save cep on cache when does not exist', async () => {
      const cacheSpy = jest.spyOn(cacheProviderMock, 'save');
      await cepService.perform('06814210');
      expect(cacheSpy).toHaveBeenCalledTimes(1);
    });

    it('should consult on cache for a cep', async () => {
      const cacheSpy = jest.spyOn(cacheProviderMock, 'recover');
      await cepService.perform('06814210');
      expect(cacheSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a cep from cache without search on internet', async () => {
      const cacheSpy = jest.spyOn(cacheProviderMock, 'recover');
      const cepSpy = jest.spyOn(cepProvider, 'cep');

      const postalCode = '06814210';
      const existingCep = {
        cep: '06814210',
        state: 'SP',
        city: 'São Paulo',
        street: 'Argentina',
        neighborhood: 'Sao Marcos',
      };

      await cacheProviderMock.save(`address-${postalCode}`, existingCep);

      await cepService.perform('06814210');
      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(cepSpy).toHaveBeenCalledTimes(0);
    });
  });
});
