import { Module } from '@nestjs/common';
import { SellsReportController } from './sells-report.controller';
import { SellsReportService } from './sells-report.service';
import { PrintService } from 'src/print/print.service';

@Module({
  controllers: [SellsReportController],
  providers: [SellsReportService, PrintService],
})
export class SellsReportModule {}
