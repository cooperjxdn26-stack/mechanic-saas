export class BackupResponseDto {
  id!: string;

  filename!: string;

  type!: string;

  status!: string;

  size!: string | null;

  createdAt!: Date;

  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
