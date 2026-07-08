import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Remueve el password antes de devolver el usuario.
   * Así evitamos exponer información sensible en las respuestas.
   */
  private removePassword<T extends { password: string }>(
    user: T,
  ): Omit<T, 'password'> {
    const { password: removedPassword, ...safeUser } = user;

    /*
     * Evita error de variable no usada.
     * No usamos el password, solo lo excluimos del objeto final.
     */
    void removedPassword;

    return safeUser;
  }

  /*
   * Lista usuarios con relaciones principales.
   * Más adelante agregaremos paginación, búsqueda y filtros.
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
        company: true,
        branch: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.removePassword(user));
  }

  /*
   * Busca un usuario por ID.
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.removePassword(user);
  }

  /*
   * Crea usuario desde el panel administrativo.
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    return this.removePassword(user);
  }

  /*
   * Actualiza usuario.
   * Si viene password, se vuelve a hashear.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    /*
     * Usamos el tipo de Prisma en vez de any.
     * Esto permite actualizar campos directos como:
     * firstName, lastName, email, phone, roleId, companyId, branchId, status, etc.
     */
    const data: Prisma.UserUncheckedUpdateInput = {
      ...updateUserDto,
    };

    /*
     * Si el usuario envía password, lo reemplazamos por la versión hasheada.
     */
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    return this.removePassword(user);
  }

  /*
   * Eliminación lógica.
   * En sistemas empresariales casi nunca borramos usuarios realmente.
   */
  async deactivate(id: string) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });
  }
}
