import { SetMetadata } from '@nestjs/common';

/*
 * Clave interna usada por RolesGuard.
 */
export const ROLES_KEY = 'roles';

/*
 * Define qué roles pueden acceder a una ruta.
 *
 * Ejemplo:
 * @Roles('SUPER_ADMIN', 'ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
