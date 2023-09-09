import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RedisStoreService } from 'src/redis-store/redis-store.service';
import { TUser } from 'src/types/user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisStoreService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { session } = context.switchToHttp().getRequest() as Request;
    const sessionEmail = session.email.email;

    const user: TUser = await this.redisService.get(sessionEmail);
    if (!user.isActive) {
      return false;
    }

    const limitReached = isLimitReached(user.activityTimestamp);
    if (!limitReached) {
      return true;
    }

    // need to deactivate and fire a future event to activate it
    await this.redisService.set(sessionEmail, { ...user, isActive: false });
    // fir event
  }
}

const isLimitReached = (activateTime: Date, limitMin = 60): boolean => {
  const now = new Date();

  const msDiff = now.getTime() - new Date(activateTime).getTime();
  const minDiff = msDiff / 1000 / 60;
  return minDiff <= limitMin;
};
