import { Module } from '@nestjs/common';

import { ContinuityController } from './continuity.controller';
import { ContinuityService } from './continuity.service';

import { PrismaModule } from '../database/prisma.module';
import { AuditLogsModule } from '../modules/audit-logs/audit-logs.module';

@Module({
  imports: [PrismaModule, AuditLogsModule],

  controllers: [ContinuityController],

  providers: [ContinuityService],
})
export class ContinuityModule {}
