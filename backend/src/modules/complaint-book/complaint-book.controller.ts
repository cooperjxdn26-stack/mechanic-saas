import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ComplaintBookStatus } from '../../generated/prisma/enums';

import { ComplaintBookService } from './complaint-book.service';
import { CreateComplaintBookEntryDto } from './dto/create-complaint-book-entry.dto';
import { UpdateComplaintBookEntryDto } from './dto/update-complaint-book-entry.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { AnswerComplaintDto } from './dto/answer-complaint.dto';

@Controller('complaint-book')
export class ComplaintBookController {
  constructor(private readonly complaintBookService: ComplaintBookService) {}

  @Post()
  create(@Body() dto: CreateComplaintBookEntryDto) {
    return this.complaintBookService.create(dto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: ComplaintBookStatus,
    @Query('branchId') branchId?: string,
    @Query('companyId') companyId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.complaintBookService.findAll({
      search,
      status,
      branchId,
      companyId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.complaintBookService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintBookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComplaintBookEntryDto) {
    return this.complaintBookService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateComplaintStatusDto) {
    return this.complaintBookService.updateStatus(id, dto);
  }

  @Patch(':id/answer')
  answer(@Param('id') id: string, @Body() dto: AnswerComplaintDto) {
    return this.complaintBookService.answer(id, dto);
  }

  @Patch(':id/close')
  close(@Param('id') id: string, @Body('changedById') changedById?: string) {
    return this.complaintBookService.close(id, changedById);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintBookService.remove(id);
  }
}
