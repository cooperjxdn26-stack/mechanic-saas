import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../database/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  roleId: string | null;
  companyId: string | null;
  branchId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      /*
       * Extrae el token desde:
       * Authorization: Bearer TOKEN
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /*
       * Si el token expiró, no se acepta.
       */
      ignoreExpiration: false,

      /*
       * Llave secreta definida en .env.
       */
      secretOrKey: jwtSecret,
    });
  }

  /*
   * Este método se ejecuta automáticamente cuando el token es válido.
   * Aquí buscamos el usuario real en base de datos.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
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

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    /*
     * Lo que retornamos aquí queda disponible en request.user.
     */
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role?.name ?? null,
      roleId: user.roleId,
      companyId: user.companyId,
      branchId: user.branchId,
    };
  }
}
