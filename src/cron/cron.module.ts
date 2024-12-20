import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';

@Module({
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
