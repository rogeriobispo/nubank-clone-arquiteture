import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import CepService from '../../services/CepService';
import CepPromiseMock from '../mocks/CepPromiseMock';
import CacheProviderMock from '../mocks/CacheProviderMock';

jest.mock('../../../../shared/middlewares/authorizedEndPoint', () =>
  jest.fn((req, res, next) => next())
);

let cepService: CepService;
let cepProvider: CepPromiseMock;
let cacheProviderMock: CacheProviderMock;

describe('Address', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    cepProvider = new CepPromiseMock();
    cacheProviderMock = new CacheProviderMock();
    cepService = new CepService(cepProvider, cacheProviderMock);
    containerSpy.mockReturnValue(cepService);
  });

  describe('search zipcode', () => {
    it('when the zipcode is found', async () => {
      const expectedResponse = {
        cep: '06814210',
        state: 'SP',
        city: 'São Paulo',
        street: 'Argentina',
        neighborhood: 'Sao Marcos',
      };
      const response = await request(app)
        .get('/cep/06814210')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it('when the cep is not found', async () => {
      const response = await request(app)
        .get('/cep/555')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        message: 'Cep Not Found',
        status: 'error',
      });
    });
  });
});
