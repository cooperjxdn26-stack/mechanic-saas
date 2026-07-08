import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Lista todos los roles disponibles.
   */
  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * Busca un rol por ID.
   */
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  /*
   * Crea un rol nuevo.
   */
  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: {
        name: createRoleDto.name,
      },
    });

    if (existingRole) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        isSystem: createRoleDto.isSystem ?? false,
      },
    });
  }

  /*
   * Actualiza un rol.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  /*
   * Elimina un rol.
   * No permitimos borrar roles del sistema.
   */
  async remove(id: string) {
    const role = await this.findOne(id);

    if (role.isSystem) {
      throw new ConflictException('No puedes eliminar un rol del sistema');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
