import 'reflect-metadata';
import CacheProviderMock from '../mocks/CacheProviderMock';
import ClearCepsService from '../../services/ClearCepsService';

let cacheProviderMock: CacheProviderMock;
let clearCepsService: ClearCepsService;

describe('ClearCepsService', () => {
  beforeEach(() => {
    cacheProviderMock = new CacheProviderMock();
    clearCepsService = new ClearCepsService(cacheProviderMock);
  });
  describe('#perform', () => {
    it('when send zipcode', async () => {
      const spyCacheProvider = jest.spyOn(cacheProviderMock, 'invalidate');

      clearCepsService.perform(['06814210', '05743200']);

      expect(spyCacheProvider).toHaveBeenCalledTimes(2);
    });

    it('when zipcode is not send', async () => {
      const spyCacheProvider = jest.spyOn(cacheProviderMock, 'invalidate');

      clearCepsService.perform([]);

      expect(spyCacheProvider).toHaveBeenCalledTimes(0);
    });
  });
});
