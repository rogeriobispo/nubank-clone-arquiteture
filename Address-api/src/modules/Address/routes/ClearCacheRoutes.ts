import { Router } from 'express';
import CacheController from '../controllers/CacheController';

const clearCacheRouter = Router();

clearCacheRouter.delete('/', CacheController.destroy);

export default clearCacheRouter;
