import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrintModule } from './print/print.module';
import { CronModule } from './cron/cron.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [PrintModule, CronModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
