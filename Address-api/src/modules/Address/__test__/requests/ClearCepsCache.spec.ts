import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import app from '../../../../server/app';
import CacheProviderMock from '../mocks/CacheProviderMock';
import ClearCepsService from '../../services/ClearCepsService';

let cacheProviderMock: CacheProviderMock;
let clearCepsService: ClearCepsService;

describe('clear cache cep', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    cacheProviderMock = new CacheProviderMock();
    clearCepsService = new ClearCepsService(cacheProviderMock);
    containerSpy.mockReturnValue(clearCepsService);
  });
  it('should clear cep', async () => {
    const spyClearCepService = jest.spyOn(clearCepsService, 'perform');

    const response = await request(app)
      .delete('/clearcache')
      .send({ ceps: ['06814210', '05743200'] })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer Token`);

    expect(response.status).toEqual(200);
    expect(spyClearCepService).toHaveBeenCalledTimes(1);
  });

  it('should be authorized user', async () => {
    const response = await request(app)
      .delete('/clearcache')
      .send({ ceps: ['06814210', '05743200'] })
      .set('Accept', 'application/json')

    expect(response.status).toEqual(401);
  })
});
