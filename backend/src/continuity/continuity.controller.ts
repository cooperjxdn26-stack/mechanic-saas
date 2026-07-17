import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ContinuityService } from './continuity.service';
import type { Prisma } from '../generated/prisma/client';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('continuity')
export class ContinuityController {
  constructor(private readonly service: ContinuityService) {}

  /*
   * Rutas de configuración de programación automática.
   * Se declaran PRIMERO para evitar que el patrón backup/:id
   * intercepte las rutas estáticas como /config.
   */
  @Get('config')
  getBackupConfig() {
    return this.service.getBackupConfig();
  }

  @Post('config')
  saveBackupConfig(@Body() data: any) {
    this.service.saveBackupConfig(data);
    return this.service.getBackupConfig();
  }

  /*
   * Rutas de backup manual.
   * Las rutas estáticas (backup/create, backup/download/:id) deben
   * declararse ANTES que las rutas dinámicas (backup/:id).
   */
  @Post('backup/create')
  createDatabaseBackup() {
    return this.service.createDatabaseBackup();
  }

  @Post('backup')
  create(@Body() data: Prisma.BackupCreateInput) {
    return this.service.create(data);
  }

  @Post('backup/restore/:id')
  restoreBackup(@Param('id') id: string) {
    return this.service.restoreBackup(id);
  }

  @Get('backup/download/:id')
  async downloadBackup(@Param('id') id: string, @Res() res: Response) {
    const file = await this.service.downloadBackup(id);

    if (!file.path) {
      throw new Error('El backup no tiene ruta de archivo');
    }

    return res.download(file.path, file.filename);
  }

  @Get('backup')
  findAll() {
    return this.service.findAll();
  }

  /*
   * Las rutas con parámetros dinámicos van AL FINAL
   * para no interceptar rutas estáticas como /backup/download/:id
   */
  @Get('backup/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete('backup/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
