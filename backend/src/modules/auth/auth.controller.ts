import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
   * Ruta pública para registrar usuarios.
   * En producción podrías protegerla para que solo ADMIN cree usuarios.
   */
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /*
   * Ruta pública para iniciar sesión.
   */
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /*
   * Ruta protegida.
   * Necesita token Bearer.
   */
  @Get('profile')
  profile(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.profile(user.id);
  }
}
