// session.module.ts
import { Module } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        store: new (connectRedis(session))({
          client: new Redis({
            host: process.env.REDIS_HOST, // Redis server host
            port: 6379, // Redis server port
          }),
        }),
        secret: process.env.SESSION_SECRET, // Replace with your own secret key
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // Set to true in a production environment with HTTPS
        },
      },
    }),
  ],
})
export class SessionConfigModule {}
