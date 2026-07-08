import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';

@Injectable()
export class DiagnosticsService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Crea un diagnóstico para una orden.
   */
  async create(createDiagnosticDto: CreateDiagnosticDto, userId?: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: {
        id: createDiagnosticDto.workOrderId,
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }

    /*
     * Si no se manda mechanicId, usamos el usuario autenticado.
     * Esto facilita el trabajo del mecánico desde su panel.
     */
    const mechanicId = createDiagnosticDto.mechanicId ?? userId;

    if (mechanicId) {
      const mechanic = await this.prisma.user.findUnique({
        where: {
          id: mechanicId,
        },
      });

      if (!mechanic) {
        throw new NotFoundException('Mecánico no encontrado');
      }
    }

    return this.prisma.diagnostic.create({
      data: {
        type: createDiagnosticDto.type ?? 'TECHNICAL',
        title: createDiagnosticDto.title,
        description: createDiagnosticDto.description,
        aiSuggestion: createDiagnosticDto.aiSuggestion,
        confidence: createDiagnosticDto.confidence,
        solution: createDiagnosticDto.solution,
        notes: createDiagnosticDto.notes,
        workOrderId: createDiagnosticDto.workOrderId,
        mechanicId,
      },
      include: {
        workOrder: {
          include: {
            vehicle: {
              include: {
                customer: true,
              },
            },
          },
        },
        mechanic: {
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
   * Lista diagnósticos.
   * Puede filtrarse por orden de trabajo.
   */
  async findAll(workOrderId?: string) {
    return this.prisma.diagnostic.findMany({
      where: {
        ...(workOrderId && { workOrderId }),
      },
      include: {
        workOrder: {
          select: {
            id: true,
            code: true,
            status: true,
            priority: true,
          },
        },
        mechanic: {
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
    });
  }

  /*
   * Detalle de diagnóstico.
   */
  async findOne(id: string) {
    const diagnostic = await this.prisma.diagnostic.findUnique({
      where: { id },
      include: {
        workOrder: {
          include: {
            vehicle: {
              include: {
                customer: true,
              },
            },
          },
        },
        mechanic: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!diagnostic) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }

    return diagnostic;
  }

  /*
   * Actualiza un diagnóstico.
   */
  async update(id: string, updateDiagnosticDto: UpdateDiagnosticDto) {
    await this.findOne(id);

    return this.prisma.diagnostic.update({
      where: { id },
      data: {
        type: updateDiagnosticDto.type,
        title: updateDiagnosticDto.title,
        description: updateDiagnosticDto.description,
        aiSuggestion: updateDiagnosticDto.aiSuggestion,
        confidence: updateDiagnosticDto.confidence,
        solution: updateDiagnosticDto.solution,
        notes: updateDiagnosticDto.notes,
        workOrderId: updateDiagnosticDto.workOrderId,
        mechanicId: updateDiagnosticDto.mechanicId,
      },
      include: {
        workOrder: true,
        mechanic: {
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
   * Elimina diagnóstico.
   * En producción podríamos cambiar esto por auditoría o soft delete.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.diagnostic.delete({
      where: { id },
    });
  }
}
