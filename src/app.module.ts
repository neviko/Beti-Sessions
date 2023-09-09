import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionConfigModule } from './session-config/session-config.module';

@Module({
  imports: [SessionConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
