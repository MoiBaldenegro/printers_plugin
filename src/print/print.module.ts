import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { PrintController } from './print.controller';

@Module({
  providers: [PrintService],
  controllers: [PrintController],
})
export class PrintModule {}
