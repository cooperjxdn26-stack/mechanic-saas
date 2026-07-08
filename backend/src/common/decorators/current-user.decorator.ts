import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  roleId: string | null;
  companyId: string | null;
  branchId: string | null;
}

interface RequestWithUser extends Request {
  user: CurrentUserPayload;
}

/**
 * Permite obtener el usuario autenticado directamente desde el controller.
 *
 * Ejemplo:
 * getProfile(@CurrentUser() user: CurrentUserPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    return request.user;
  },
);
