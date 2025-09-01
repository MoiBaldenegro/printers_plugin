import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrintModule } from './print/print.module';
import { CronModule } from './cron/cron.module';
import { ConfigModule } from './config/config.module';
import { SellsReportModule } from './sells-report/sells-report.module';
import { AssistanceReportModule } from './assistance-report/assistance-report.module';
import { ReprintModule } from './reprint/reprint.module';

@Module({
  imports: [
    PrintModule,
    CronModule,
    ConfigModule,
    SellsReportModule,
    AssistanceReportModule,
    ReprintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
