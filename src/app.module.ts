import { Module } from '@nestjs/common';
import { SessionConfigModule } from './session-config/session-config.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SessionConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: parseInt(process.env.REDIS_PORT) || 6379,
          },
        }),
      }),
    }),
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
