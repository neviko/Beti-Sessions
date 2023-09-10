import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisStoreService } from 'src/redis-store/redis-store.service';
import { BullModule } from '@nestjs/bull';
import { ConsumerService } from 'src/bull-queue/consumer.service';
import { activationQueue } from 'src/constants/queue.constants';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: activationQueue,
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisStoreService, ConsumerService],
})
export class AuthModule {}
