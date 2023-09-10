import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RedisStoreService } from 'src/redis-store/redis-store.service';
import { TUser } from 'src/types/user.type';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  activationQueue,
  fiveMinutes,
  oneHour,
  tenSeconds,
} from 'src/constants/queue.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisStoreService,
    @InjectQueue(activationQueue) private queue: Queue,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { session } = context.switchToHttp().getRequest() as Request;
    const sessionEmail = session.email.email;

    const user: TUser = await this.redisService.get(sessionEmail);
    if (!user.isActive) {
      return false;
    }

    const limitReached = isLimitReached(user.activityTimestamp, 1);
    if (!limitReached) {
      return true;
    }

    // need to deactivate and fire a future event to activate it
    await this.redisService.set(sessionEmail, { ...user, isActive: false });
    // fire event
    this.queue.add(user, { delay: tenSeconds });
  }
}

const isLimitReached = (
  activateTime: Date,
  limitMinutes = oneHour,
): boolean => {
  const now = new Date();

  const msDiff = now.getTime() - new Date(activateTime).getTime();
  const minDiff = msDiff / 1000 / 60;
  return minDiff > limitMinutes;
};
