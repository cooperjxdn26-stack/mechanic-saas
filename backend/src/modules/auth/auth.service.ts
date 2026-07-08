import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /*
   * Registra un nuevo usuario.
   */
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hashedPassword,
        phone: registerDto.phone,
        companyId: registerDto.companyId,
        branchId: registerDto.branchId,
        roleId: registerDto.roleId,
      },
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    const token = await this.generateToken(user.id, user.email);

    return {
      message: 'Usuario registrado correctamente',
      accessToken: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role?.name ?? null,
        roleId: user.roleId,
        companyId: user.companyId,
        branchId: user.branchId,
      },
    };
  }

  /*
   * Inicia sesión.
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    const token = await this.generateToken(user.id, user.email);

    return {
      message: 'Inicio de sesión correcto',
      accessToken: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role?.name ?? null,
        roleId: user.roleId,
        companyId: user.companyId,
        branchId: user.branchId,
      },
    };
  }

  /*
   * Obtiene el perfil del usuario autenticado.
   */
  async profile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
        company: true,
        branch: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role?.name ?? null,
      roleId: user.roleId,
      companyId: user.companyId,
      branchId: user.branchId,
      company: user.company,
      branch: user.branch,
    };
  }

  /*
   * Genera el token JWT.
   */
  private async generateToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload);
  }
}
