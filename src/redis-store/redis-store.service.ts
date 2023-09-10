import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisStoreService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager) {}

  async set(key: string, value: any) {
    return this.cacheManager.set(key, value);
  }

  async get(key: string): Promise<any> {
    const cachedValue = await this.cacheManager.get(key);
    return cachedValue;
  }
}
