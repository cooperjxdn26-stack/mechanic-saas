import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * Solo SUPER_ADMIN y ADMIN pueden listar usuarios.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /*
   * Ver detalle de usuario.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /*
   * Crear usuario desde administración.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /*
   * Actualizar usuario.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /*
   * Desactivar usuario.
   * No lo borramos físicamente.
   */
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
