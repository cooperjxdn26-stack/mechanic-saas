import { Module } from '@nestjs/common';

import { ComplaintBookController } from './complaint-book.controller';
import { ComplaintBookService } from './complaint-book.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplaintBookController],
  providers: [ComplaintBookService],
  exports: [ComplaintBookService],
})
export class ComplaintBookModule {}
