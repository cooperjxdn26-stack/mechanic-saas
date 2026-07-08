import { SetMetadata } from '@nestjs/common';

/*
 * Clave interna usada por el JwtAuthGuard.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/*
 * Este decorador marca una ruta como pública.
 * Ejemplo:
 * @Public()
 * @Post('login')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
