import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationStatus, NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  /*
   * Título breve.
   */
  @IsString()
  title!: string;

  /*
   * Mensaje principal de la notificación.
   */
  @IsString()
  message!: string;

  /*
   * Tipo:
   * INTERNAL, EMAIL, WHATSAPP, SYSTEM.
   */
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  /*
   * Estado:
   * PENDING, SENT, READ, FAILED.
   */
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  /*
   * URL a la que puede llevar la notificación.
   */
  @IsOptional()
  @IsString()
  actionUrl?: string;

  /*
   * Usuario destinatario.
   */
  @IsOptional()
  @IsString()
  userId?: string;
}
