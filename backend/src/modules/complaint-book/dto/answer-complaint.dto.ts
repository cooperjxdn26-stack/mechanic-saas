import { IsOptional, IsString } from 'class-validator';

export class AnswerComplaintDto {
  @IsOptional()
  @IsString()
  providerObservation?: string;

  @IsOptional()
  @IsString()
  actionsTaken?: string;

  @IsString()
  responseDetail!: string;

  @IsOptional()
  @IsString()
  answeredById?: string;
}
