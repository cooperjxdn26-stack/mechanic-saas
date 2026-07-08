import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ComplaintBookStatus } from '../../../generated/prisma/enums';

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintBookStatus)
  status!: ComplaintBookStatus;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  changedById?: string;
}
