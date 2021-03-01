import { injectable, inject } from 'tsyringe';
import ICacheProvider from '../../../shared/container/providers/cacheProvider/models/ICacheProvider';

@injectable()
class ClearCepsService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async perform(postalCodes: string[]): Promise<void> {
    postalCodes.forEach((postalCode) =>
      this.cacheProvider.invalidate(postalCode)
    );
  }
}

export default ClearCepsService;
