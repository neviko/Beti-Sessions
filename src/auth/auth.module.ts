import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisStoreService } from 'src/redis-store/redis-store.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RedisStoreService],
})
export class AuthModule {}
