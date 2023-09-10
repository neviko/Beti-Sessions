import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { activationQueue } from 'src/constants/queue.constants';
import { RedisStoreService } from 'src/redis-store/redis-store.service';
import { TUser } from 'src/types/user.type';

@Processor(activationQueue)
export class ConsumerService {
  constructor(private readonly redisService: RedisStoreService) {}
  @Process()
  async transcode(job: Job<TUser>) {
    const user = job.data as TUser;
    this.redisService.set(user.email, {
      ...user,
      activityTimestamp: new Date(),
    });
    console.log(`user - ${user.email} back in business`);
    return {};
  }
}
