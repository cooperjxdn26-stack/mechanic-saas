import {
  BadgeCheck,
  Building2,
  Database,
  Gauge,
  Globe,
  HardDrive,
  Palette,
  Server,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { appConfig } from "@/config/app";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950 p-6 text-white shadow-sm">
        <div className="absolute right-6 top-6 opacity-20">
          <Wrench className="h-28 w-28" />
        </div>

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Settings className="h-6 w-6" />
              </div>

              <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                Panel administrativo
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Configuración del sistema
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              Administra la identidad del taller, preferencias generales, estado
              técnico y parámetros base de MechanicPro SaaS.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-zinc-300">
              Estado del sistema
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <p className="font-semibold">Operativo</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <SettingsCard
          title="Aplicación"
          description="Datos técnicos del frontend."
          icon={Globe}
        >
          <Info label="Nombre" value={appConfig.name} />
          <Info label="API URL" value={appConfig.apiUrl} />
          <Info label="Entorno" value={process.env.NODE_ENV} />
        </SettingsCard>

        <SettingsCard
          title="Identidad visual"
          description="Estilo sugerido para el sistema."
          icon={Palette}
        >
          <ColorInfo label="Grafito" value="#111827" color="bg-zinc-900" />
          <ColorInfo
            label="Naranja mecánico"
            value="#f97316"
            color="bg-orange-500"
          />
          <ColorInfo
            label="Amarillo alerta"
            value="#facc15"
            color="bg-yellow-400"
          />
        </SettingsCard>

        <SettingsCard
          title="Seguridad"
          description="Control de accesos y roles."
          icon={ShieldCheck}
        >
          <StatusItem label="Autenticación con token" status="Activo" />
          <StatusItem label="Permisos por rol" status="Activo" />
          <StatusItem label="Rutas protegidas" status="En progreso" />
        </SettingsCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsCard
          title="Datos del taller"
          description="Información de empresa pendiente de edición."
          icon={Building2}
        >
          <Info label="Nombre comercial" value="Taller Demo" />
          <Info label="RUC" value="00000000000" />
          <Info label="Correo" value="demo@taller.com" />
          <Info label="Moneda" value="Soles peruanos PEN" />
        </SettingsCard>

        <SettingsCard
          title="Infraestructura"
          description="Estado técnico de los servicios principales."
          icon={Server}
        >
          <TechStatus
            icon={Database}
            title="Base de datos"
            value="PostgreSQL conectado"
            status="OK"
          />

          <TechStatus
            icon={HardDrive}
            title="ORM"
            value="Prisma activo"
            status="OK"
          />

          <TechStatus
            icon={Gauge}
            title="API Backend"
            value="NestJS REST API"
            status="OK"
          />
        </SettingsCard>
      </div>

      <Card className="overflow-hidden rounded-3xl border-orange-200 bg-orange-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-950">
            <Wrench className="h-5 w-5" />
            Próximas mejoras recomendadas
          </CardTitle>
          <p className="text-sm text-orange-900/80">
            Estas opciones pueden convertir la pantalla de configuración en un
            módulo administrativo completo.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {improvements.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-orange-200 bg-white p-4 text-sm text-zinc-700 shadow-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const improvements = [
  "Editar datos reales del taller: nombre, RUC, dirección, correo y teléfono.",
  "Subir logo del taller y mostrarlo en sidebar, facturas y cotizaciones.",
  "Cambiar tema visual: mecánico oscuro, claro o naranja industrial.",
  "Configurar moneda, IGV, zona horaria y formato de fecha.",
  "Administrar sucursales y cajas por sucursal.",
  "Configurar numeración automática de facturas, órdenes y cotizaciones.",
  "Definir stock mínimo global y alertas de inventario.",
  "Configurar mensajes predeterminados para cotizaciones públicas.",
  "Activar o desactivar notificaciones por módulo.",
  "Configurar permisos avanzados por rol.",
  "Exportar respaldo de datos importantes.",
  "Ver estado del backend, base de datos y versión del sistema.",
];

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: SettingsCardProps) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <Icon className="h-6 w-6" />
        </div>

        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all font-semibold">{value}</p>
    </div>
  );
}

interface ColorInfoProps {
  label: string;
  value: string;
  color: string;
}

function ColorInfo({ label, value, color }: ColorInfoProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-3">
        <span className={`h-8 w-8 rounded-xl border ${color}`} />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  status: string;
}

function StatusItem({ label, status }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
      <p className="text-sm font-medium">{label}</p>
      <Badge variant="outline">{status}</Badge>
    </div>
  );
}

interface TechStatusProps {
  icon: React.ElementType;
  title: string;
  value: string;
  status: string;
}

function TechStatus({ icon: Icon, title, value, status }: TechStatusProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{value}</p>
        </div>
      </div>

      <Badge className="bg-emerald-600 hover:bg-emerald-600">{status}</Badge>
    </div>
  );
}
