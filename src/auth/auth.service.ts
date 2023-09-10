import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RedisStoreService } from '../redis-store/redis-store.service';

@Injectable()
export class AuthService {
  constructor(
    // private readonly logger = new Logger('auth-service-logger'),
    private readonly redisService: RedisStoreService,
  ) {}

  async register(email: string) {
    const user = await this.redisService.get(email);
    console.log(`user is: ${user}`);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    try {
      return this.redisService.set(email, 'registered');
    } catch (e) {
      //   this.logger.error('df');
      throw new InternalServerErrorException(e);
    }
  }

  async login(email: string) {
    const user = await this.redisService.get(email);
    if (!user) {
      throw new BadRequestException('User is not exists');
    }
    // setting session info
    await this.redisService.set(email, {
      isActive: true,
      activityTimestamp: new Date(),
      email,
    });
  }
}
