import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisStoreService } from 'src/redis-store/redis-store.service';
import { TUser } from 'src/types/user.type';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { activationQueue, fiveMinutes } from 'src/constants/queue.constants';

@Injectable()
export class ActivityGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisStoreService,
    @InjectQueue(activationQueue) private queue: Queue,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { session } = context.switchToHttp().getRequest() as Request;
    const sessionEmail = session.email.email;

    const user: TUser = await this.redisService.get(sessionEmail);
    if (!user.isActive) {
      Logger.log(
        `user - ${user.email} have tried to access but he is in a cooldown period`,
      );
      return false;
    }

    const limitReached = isLimitReached(user.activityTimestamp);
    if (!limitReached) {
      return true;
    }

    await this.redisService.set(sessionEmail, { ...user, isActive: false });
    Logger.log(`user - ${user.email} have been deactivated`);

    const delay = fiveMinutes;
    this.queue.add(user, { delay });
    Logger.log(
      `future activation event sent for user - ${user.email}, will be consumed in: ${delay} MS`,
    );
  }
}

const isLimitReached = (activateTime: Date, limitMinutes = 60): boolean => {
  const now = new Date();

  const msDiff = now.getTime() - new Date(activateTime).getTime();
  const minDiff = msDiff / 1000 / 60;
  return minDiff > limitMinutes;
};
