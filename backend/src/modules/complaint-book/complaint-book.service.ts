import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client';
import { ComplaintBookStatus } from '../../generated/prisma/enums';

import { PrismaService } from '../../database/prisma.service';

import { CreateComplaintBookEntryDto } from './dto/create-complaint-book-entry.dto';
import { UpdateComplaintBookEntryDto } from './dto/update-complaint-book-entry.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { AnswerComplaintDto } from './dto/answer-complaint.dto';

@Injectable()
export class ComplaintBookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComplaintBookEntryDto) {
    const code = await this.generateComplaintCode();

    const registeredAt = new Date();
    const dueDate = this.addBusinessDays(registeredAt, 15);

    return this.prisma.complaintBookEntry.create({
      data: {
        code,
        physicalSheetNumber: dto.physicalSheetNumber,

        companyId: dto.companyId,
        branchId: dto.branchId,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        workOrderId: dto.workOrderId,

        claimantType: dto.claimantType,
        claimantName: dto.claimantName,
        claimantDocumentType: dto.claimantDocumentType,
        claimantDocumentNumber: dto.claimantDocumentNumber,
        claimantAddress: dto.claimantAddress,
        claimantPhone: dto.claimantPhone,
        claimantEmail: dto.claimantEmail,

        isMinor: dto.isMinor ?? false,
        guardianName: dto.guardianName,
        guardianDocumentType: dto.guardianDocumentType,
        guardianDocumentNumber: dto.guardianDocumentNumber,
        guardianAddress: dto.guardianAddress,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,

        goodType: dto.goodType,
        claimedAmount: dto.claimedAmount
          ? new Prisma.Decimal(dto.claimedAmount)
          : undefined,
        goodDescription: dto.goodDescription,

        serviceOrderCode: dto.serviceOrderCode,
        vehiclePlate: dto.vehiclePlate,
        vehicleBrand: dto.vehicleBrand,
        vehicleModel: dto.vehicleModel,
        serviceDate: dto.serviceDate ? new Date(dto.serviceDate) : undefined,
        paymentDocument: dto.paymentDocument,

        caseType: dto.caseType,
        detail: dto.detail,
        customerRequest: dto.customerRequest,
        responseMethod: dto.responseMethod,

        createdById: dto.createdById,
        acceptedDeclaration: dto.acceptedDeclaration ?? false,

        registeredAt,
        dueDate,

        histories: {
          create: {
            oldStatus: null,
            newStatus: ComplaintBookStatus.REGISTERED,
            comment: 'Reclamación registrada en el libro de reclamaciones.',
            changedById: dto.createdById,
          },
        },
      },
      include: this.defaultInclude(),
    });
  }

  async findAll(params?: {
    search?: string;
    status?: ComplaintBookStatus;
    branchId?: string;
    companyId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ComplaintBookEntryWhereInput = {
      companyId: params?.companyId || undefined,
      branchId: params?.branchId || undefined,
      status: params?.status || undefined,
      OR: params?.search
        ? [
            {
              code: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              claimantName: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              claimantDocumentNumber: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              vehiclePlate: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.complaintBookEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          registeredAt: 'desc',
        },
        include: this.defaultInclude(),
      }),
      this.prisma.complaintBookEntry.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const complaint = await this.prisma.complaintBookEntry.findUnique({
      where: { id },
      include: {
        ...this.defaultInclude(),
        histories: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            changedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        attachments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            uploadedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!complaint) {
      throw new NotFoundException('Reclamación no encontrada');
    }

    return complaint;
  }

  async findByCode(code: string) {
    const complaint = await this.prisma.complaintBookEntry.findUnique({
      where: { code },
      include: this.defaultInclude(),
    });

    if (!complaint) {
      throw new NotFoundException(
        'No se encontró una reclamación con ese código',
      );
    }

    return complaint;
  }

  async update(id: string, dto: UpdateComplaintBookEntryDto) {
    await this.findOne(id);

    return this.prisma.complaintBookEntry.update({
      where: { id },
      data: {
        physicalSheetNumber: dto.physicalSheetNumber,

        companyId: dto.companyId,
        branchId: dto.branchId,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        workOrderId: dto.workOrderId,

        claimantType: dto.claimantType,
        claimantName: dto.claimantName,
        claimantDocumentType: dto.claimantDocumentType,
        claimantDocumentNumber: dto.claimantDocumentNumber,
        claimantAddress: dto.claimantAddress,
        claimantPhone: dto.claimantPhone,
        claimantEmail: dto.claimantEmail,

        isMinor: dto.isMinor,
        guardianName: dto.guardianName,
        guardianDocumentType: dto.guardianDocumentType,
        guardianDocumentNumber: dto.guardianDocumentNumber,
        guardianAddress: dto.guardianAddress,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,

        goodType: dto.goodType,
        claimedAmount:
          dto.claimedAmount !== undefined
            ? new Prisma.Decimal(dto.claimedAmount)
            : undefined,
        goodDescription: dto.goodDescription,

        serviceOrderCode: dto.serviceOrderCode,
        vehiclePlate: dto.vehiclePlate,
        vehicleBrand: dto.vehicleBrand,
        vehicleModel: dto.vehicleModel,
        serviceDate: dto.serviceDate ? new Date(dto.serviceDate) : undefined,
        paymentDocument: dto.paymentDocument,

        caseType: dto.caseType,
        detail: dto.detail,
        customerRequest: dto.customerRequest,
        responseMethod: dto.responseMethod,

        acceptedDeclaration: dto.acceptedDeclaration,
      },
      include: this.defaultInclude(),
    });
  }

  async updateStatus(id: string, dto: UpdateComplaintStatusDto) {
    const complaint = await this.findOne(id);

    return this.prisma.complaintBookEntry.update({
      where: { id },
      data: {
        status: dto.status,
        histories: {
          create: {
            oldStatus: complaint.status,
            newStatus: dto.status,
            comment: dto.comment,
            changedById: dto.changedById,
          },
        },
      },
      include: this.defaultInclude(),
    });
  }

  async answer(id: string, dto: AnswerComplaintDto) {
    const complaint = await this.findOne(id);

    if (
      complaint.status === ComplaintBookStatus.CLOSED ||
      complaint.status === ComplaintBookStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'No se puede responder una reclamación cerrada o anulada',
      );
    }

    return this.prisma.complaintBookEntry.update({
      where: { id },
      data: {
        providerObservation: dto.providerObservation,
        actionsTaken: dto.actionsTaken,
        responseDetail: dto.responseDetail,
        answeredById: dto.answeredById,
        answeredAt: new Date(),
        status: ComplaintBookStatus.ANSWERED,
        histories: {
          create: {
            oldStatus: complaint.status,
            newStatus: ComplaintBookStatus.ANSWERED,
            comment: 'La reclamación fue respondida por el proveedor.',
            changedById: dto.answeredById,
          },
        },
      },
      include: this.defaultInclude(),
    });
  }

  async close(id: string, changedById?: string) {
    const complaint = await this.findOne(id);

    return this.prisma.complaintBookEntry.update({
      where: { id },
      data: {
        status: ComplaintBookStatus.CLOSED,
        closedAt: new Date(),
        histories: {
          create: {
            oldStatus: complaint.status,
            newStatus: ComplaintBookStatus.CLOSED,
            comment: 'La reclamación fue cerrada.',
            changedById,
          },
        },
      },
      include: this.defaultInclude(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.complaintBookEntry.update({
      where: { id },
      data: {
        status: ComplaintBookStatus.CANCELLED,
      },
      include: this.defaultInclude(),
    });
  }

  private async generateComplaintCode() {
    const year = new Date().getFullYear();

    const totalThisYear = await this.prisma.complaintBookEntry.count({
      where: {
        registeredAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
    });

    const correlative = String(totalThisYear + 1).padStart(6, '0');

    return `LR-${year}-${correlative}`;
  }

  private addBusinessDays(date: Date, days: number) {
    const result = new Date(date);
    let addedDays = 0;

    while (addedDays < days) {
      result.setDate(result.getDate() + 1);

      const day = result.getDay();

      if (day !== 0 && day !== 6) {
        addedDays++;
      }
    }

    return result;
  }

  private defaultInclude() {
    return {
      company: {
        select: {
          id: true,
          name: true,
          ruc: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          documentNumber: true,
          phone: true,
          email: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          plate: true,
          brand: true,
          model: true,
        },
      },
      workOrder: {
        select: {
          id: true,
          code: true,
          reason: true,
          status: true,
        },
      },
      responsible: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      answeredBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    };
  }
}
