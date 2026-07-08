import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Ejecutando seed...');

  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Acceso total al sistema',
      isSystem: true,
    },
    {
      name: 'ADMIN',
      description: 'Administrador del taller',
      isSystem: true,
    },
    {
      name: 'RECEPTIONIST',
      description: 'Recepción, clientes, vehículos, citas y órdenes iniciales',
      isSystem: true,
    },
    {
      name: 'MECHANIC',
      description: 'Gestión técnica de órdenes, diagnóstico y checklist',
      isSystem: true,
    },
    {
      name: 'CASHIER',
      description: 'Pagos, caja, facturación y cuentas por cobrar',
      isSystem: true,
    },
    {
      name: 'CUSTOMER',
      description: 'Portal del cliente',
      isSystem: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
        isSystem: role.isSystem,
      },
      create: role,
    });
  }

  const company = await prisma.company.upsert({
    where: {
      ruc: '00000000000',
    },
    update: {
      name: 'Taller Demo',
      email: 'demo@taller.com',
      phone: '999999999',
      address: 'Lima, Perú',
    },
    create: {
      name: 'Taller Demo',
      ruc: '00000000000',
      email: 'demo@taller.com',
      phone: '999999999',
      address: 'Lima, Perú',
    },
  });

  let branch = await prisma.branch.findFirst({
    where: {
      companyId: company.id,
      isMain: true,
    },
  });

  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        name: 'Sucursal Principal',
        address: 'Lima, Perú',
        phone: '999999999',
        isMain: true,
        companyId: company.id,
      },
    });
  }

  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: 'SUPER_ADMIN',
    },
  });

  if (!superAdminRole) {
    throw new Error('No se encontró el rol SUPER_ADMIN');
  }

  const hashedPassword = await bcrypt.hash('Admin123456', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@mechanic.com',
    },
    update: {
      firstName: 'Super',
      lastName: 'Admin',
      phone: '999999999',
      companyId: company.id,
      branchId: branch.id,
      roleId: superAdminRole.id,
    },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@mechanic.com',
      password: hashedPassword,
      phone: '999999999',
      companyId: company.id,
      branchId: branch.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Seed ejecutado correctamente');
  console.log('Usuario: admin@mechanic.com');
  console.log('Password: Admin123456');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
