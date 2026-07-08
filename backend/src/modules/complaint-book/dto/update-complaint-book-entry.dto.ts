import { PartialType } from '@nestjs/mapped-types';
import { CreateComplaintBookEntryDto } from './create-complaint-book-entry.dto';

export class UpdateComplaintBookEntryDto extends PartialType(
  CreateComplaintBookEntryDto,
) {}
