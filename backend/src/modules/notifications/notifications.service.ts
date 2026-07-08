import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea una notificación interna.
   * Más adelante puede disparar email o WhatsApp.
   */
  async create(dto: CreateNotificationDto) {
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuario destinatario no encontrado');
      }
    }

    return this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type ?? 'INTERNAL',
        status: dto.status ?? 'PENDING',
        actionUrl: dto.actionUrl,
        userId: dto.userId,
        sentAt: dto.status === 'SENT' ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  /*
   * Lista notificaciones con filtros y paginación.
   */
  async findAll(query: NotificationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    /*
     * where dinámico tipado con Prisma.
     * Evitamos any para eliminar errores de unsafe assignment.
     */
    const where: Prisma.NotificationWhereInput = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.notification.count({
        where,
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /*
   * Notificaciones del usuario autenticado.
   */
  async findMine(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  /*
   * Marcar como leída.
   */
  async markAsRead(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });
  }

  /*
   * Marcar todas las notificaciones de un usuario como leídas.
   */
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        status: {
          not: 'READ',
        },
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    return {
      message: 'Notificaciones marcadas como leídas',
    };
  }

  /*
   * Contador de no leídas.
   */
  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        status: {
          not: 'READ',
        },
      },
    });

    return {
      unread: count,
    };
  }
}
