import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Prisma } from '../generated/prisma/client';
import { AuditLogsService } from '../modules/audit-logs/audit-logs.service';
import { AuditAction } from '../generated/prisma/client';
import * as shell from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContinuityService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(data: Prisma.BackupCreateInput) {
    return await this.prisma.backup.create({
      data,
    });
  }

  async downloadBackup(id: string) {
    const backup = await this.prisma.backup.findUnique({
      where: {
        id,
      },
    });

    if (!backup) {
      throw new Error('Backup no encontrado');
    }

    await this.auditLogsService.create({
      action: AuditAction.DOWNLOAD_BACKUP,

      module: 'CONTINUITY',

      entity: 'Backup',

      entityId: backup.id,

      description: `Descarga de backup ${backup.filename}`,

      metadata: {
        filename: backup.filename,
        path: backup.path,
      },

      userId: backup.createdById ?? undefined,

      companyId: backup.companyId ?? undefined,
    });

    return backup;
  }

  async restoreBackup(id: string, userId?: string, companyId?: string) {
    const backup = await this.prisma.backup.findUnique({
      where: {
        id,
      },
    });

    if (!backup) {
      throw new Error('Backup no encontrado');
    }

    if (!backup.path) {
      throw new Error('Archivo no encontrado');
    }

    const databaseUrl = process.env.DATABASE_URL?.split('?')[0];

    const command = `psql "${databaseUrl}" < "${backup.path}"`;

    const result = shell.exec(command);

    if (result.code !== 0) {
      await this.auditLogsService.create({
        action: AuditAction.RESTORE_BACKUP,

        module: 'CONTINUITY',

        entity: 'Backup',

        entityId: backup.id,

        description: `Falló restauración del backup ${backup.filename}`,

        metadata: {
          filename: backup.filename,
          error: result.stderr,
        },

        userId,

        companyId,
      });

      return {
        status: 'FAILED',

        message: 'No se pudo restaurar el backup',
      };
    }

    await this.auditLogsService.create({
      action: AuditAction.RESTORE_BACKUP,

      module: 'CONTINUITY',

      entity: 'Backup',

      entityId: backup.id,

      description: `Backup restaurado correctamente ${backup.filename}`,

      metadata: {
        filename: backup.filename,
      },

      userId,

      companyId,
    });

    return {
      status: 'SUCCESS',

      message: 'Backup restaurado correctamente',
    };
  }

  async createDatabaseBackup(userId?: string, companyId?: string) {
    const date = new Date().toISOString().replace(/[:.]/g, '-');

    const filename = `backup_${date}.sql`;

    const backupFolder = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder);
    }

    const filePath = path.join(backupFolder, filename);

    const databaseUrl = process.env.DATABASE_URL?.split('?')[0];

    const command = `pg_dump "${databaseUrl}" > "${filePath}"`;

    const result = shell.exec(command);

    // Si falla la creación del backup
    if (result.code !== 0) {
      const failedBackup = await this.prisma.backup.create({
        data: {
          filename,
          path: filePath,
          status: 'FAILED',
          type: 'MANUAL',
          createdById: userId,
          companyId,
        },
      });

      await this.auditLogsService.create({
        action: AuditAction.CREATE_BACKUP_FAILED,

        module: 'CONTINUITY',

        entity: 'Backup',

        entityId: failedBackup.id,

        description: `Falló la creación del backup ${filename}`,

        userId,

        companyId,

        metadata: {
          status: 'FAILED',
          filename,
        },
      });

      return failedBackup;
    }

    // Tamaño del archivo generado
    const stats = fs.statSync(filePath);

    const backup = await this.prisma.backup.create({
      data: {
        filename,

        path: filePath,

        size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,

        status: 'SUCCESS',

        type: 'MANUAL',

        createdById: userId,

        companyId,
      },
    });

    // Registro de auditoría
    await this.auditLogsService.create({
      action: AuditAction.CREATE_BACKUP,

      module: 'CONTINUITY',

      entity: 'Backup',

      entityId: backup.id,

      description: `Se creó correctamente el backup ${filename}`,

      userId,

      companyId,

      metadata: {
        filename,

        size: backup.size,

        status: backup.status,
      },
    });

    return backup;
  }

  async findAll() {
    return this.prisma.backup.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.backup.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        createdBy: true,
      },
    });
  }

  async remove(id: string, userId?: string) {
    const backup = await this.prisma.backup.findUnique({
      where: {
        id,
      },
    });

    if (!backup) {
      throw new Error('Backup no encontrado');
    }

    // eliminar archivo físico
    if (backup.path && fs.existsSync(backup.path)) {
      fs.unlinkSync(backup.path);
    }

    const deleted = await this.prisma.backup.delete({
      where: {
        id,
      },
    });

    await this.auditLogsService.create({
      action: AuditAction.DELETE,

      module: 'CONTINUITY',

      entity: 'Backup',

      entityId: id,

      description: `Backup eliminado ${backup.filename}`,

      userId,

      metadata: {
        filename: backup.filename,
      },
    });

    return {
      status: 'SUCCESS',
      message: 'Backup eliminado correctamente',
    };
  }

  onModuleInit() {
    // Comprobar la programación cada 1 minuto (60000ms)
    setInterval(() => {
      void this.checkAndRunScheduledBackup();
    }, 60000);
  }

  private getConfigPath(): string {
    const backupFolder = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder);
    }
    return path.join(backupFolder, 'backup-config.json');
  }

  getBackupConfig() {
    const configPath = this.getConfigPath();
    const defaultConfig = {
      enabled: false,
      frequency: 'DAILY',
      hour: 2,
      minute: 0,
      dayOfWeek: 1, // Lunes
      maxBackups: 5,
      lastExecuted: null,
    };

    if (!fs.existsSync(configPath)) {
      this.saveBackupConfig(defaultConfig);
      return defaultConfig;
    }

    try {
      const data = fs.readFileSync(configPath, 'utf8');
      return { ...defaultConfig, ...JSON.parse(data) };
    } catch {
      return defaultConfig;
    }
  }

  saveBackupConfig(config: any) {
    const configPath = this.getConfigPath();
    // Limpiar campos que no deban guardarse o asegurar tipos
    const cleanConfig = {
      enabled: Boolean(config.enabled ?? false),
      frequency: String(config.frequency ?? 'DAILY'),
      hour: Math.max(0, Math.min(23, Number(config.hour ?? 2))),
      minute: Math.max(0, Math.min(59, Number(config.minute ?? 0))),
      dayOfWeek: config.dayOfWeek !== undefined ? Number(config.dayOfWeek) : 1,
      maxBackups: Math.max(1, Number(config.maxBackups ?? 5)),
      lastExecuted: config.lastExecuted ?? null,
    };
    fs.writeFileSync(configPath, JSON.stringify(cleanConfig, null, 2), 'utf8');
  }

  async checkAndRunScheduledBackup() {
    const config = this.getBackupConfig();
    if (!config.enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Comprobar si coincide la hora y el minuto programado
    if (currentHour !== config.hour || currentMinute !== config.minute) {
      return;
    }

    // Comprobar la frecuencia
    if (config.frequency === 'WEEKLY') {
      const dayOfWeek = config.dayOfWeek ?? 1; // 1 = Lunes, 0 = Domingo, etc.
      if (now.getDay() !== dayOfWeek) {
        return;
      }
    } else if (config.frequency === 'MONTHLY') {
      // Si la frecuencia es mensual, corre el primer día de cada mes
      if (now.getDate() !== 1) {
        return;
      }
    }

    // Evitar que se ejecute más de una vez en el mismo día
    const todayStr = now.toDateString(); // Ej: "Fri Jul 17 2026"
    if (config.lastExecuted && config.lastExecuted === todayStr) {
      return;
    }

    console.log(`⏰ Iniciando copia de seguridad automática programada [Frecuencia: ${config.frequency}]...`);
    try {
      await this.runAutomaticBackup(config.maxBackups);
      
      // Registrar última ejecución para evitar duplicados en el mismo día
      config.lastExecuted = todayStr;
      this.saveBackupConfig(config);
    } catch (err) {
      console.error('❌ Error ejecutando copia de seguridad programada:', err);
    }
  }

  async runAutomaticBackup(maxBackups: number) {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_auto_${date}.sql`;
    const backupFolder = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder);
    }

    const filePath = path.join(backupFolder, filename);
    const databaseUrl = process.env.DATABASE_URL?.split('?')[0];
    const command = `pg_dump "${databaseUrl}" > "${filePath}"`;

    const result = shell.exec(command);

    if (result.code !== 0) {
      const failedBackup = await this.prisma.backup.create({
        data: {
          filename,
          path: filePath,
          status: 'FAILED',
          type: 'AUTOMATIC',
        },
      });

      await this.auditLogsService.create({
        action: AuditAction.CREATE_BACKUP_FAILED,
        module: 'CONTINUITY',
        entity: 'Backup',
        entityId: failedBackup.id,
        description: `Falló la creación del backup automático ${filename}`,
        metadata: {
          status: 'FAILED',
          filename,
        },
      });

      return failedBackup;
    }

    const stats = fs.statSync(filePath);
    const backup = await this.prisma.backup.create({
      data: {
        filename,
        path: filePath,
        size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'SUCCESS',
        type: 'AUTOMATIC',
      },
    });

    await this.auditLogsService.create({
      action: AuditAction.CREATE_BACKUP,
      module: 'CONTINUITY',
      entity: 'Backup',
      entityId: backup.id,
      description: `Se creó correctamente el backup automático ${filename}`,
      metadata: {
        filename,
        size: backup.size,
        status: backup.status,
      },
    });

    // Aplicar retención a backups automáticos
    await this.applyBackupRetention(maxBackups);

    return backup;
  }

  async applyBackupRetention(maxBackups: number) {
    // Buscar todos los backups de tipo AUTOMATIC exitosos ordenados por fecha ascendente (el más viejo primero)
    const backups = await this.prisma.backup.findMany({
      where: {
        type: 'AUTOMATIC',
        status: { in: ['SUCCESS', 'RESTORED'] },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (backups.length > maxBackups) {
      const toDeleteCount = backups.length - maxBackups;
      const toDeleteList = backups.slice(0, toDeleteCount);

      for (const backup of toDeleteList) {
        console.log(`🧹 Eliminando backup automático antiguo por límite de retención (${maxBackups}): ${backup.filename}`);
        
        // Eliminar archivo físico
        if (backup.path && fs.existsSync(backup.path)) {
          try {
            fs.unlinkSync(backup.path);
          } catch (err) {
            console.error(`No se pudo eliminar el archivo físico ${backup.path}:`, err);
          }
        }

        // Eliminar registro de BD
        await this.prisma.backup.delete({
          where: {
            id: backup.id,
          },
        });
      }
    }
  }
}
