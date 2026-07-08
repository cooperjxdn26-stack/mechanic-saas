"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ComplaintBookEntry,
  ComplaintBookStatus,
  CreateComplaintBookEntryPayload,
} from "@/types/complaint-book";
import {
  createComplaintBookEntry,
  getComplaintBookEntries,
  updateComplaintStatus,
} from "@/lib/complaint-book.api";

const statusLabels: Record<ComplaintBookStatus, string> = {
  REGISTERED: "Registrado",
  UNDER_REVIEW: "En revisión",
  ANSWERED: "Respondido",
  CLOSED: "Cerrado",
  EXPIRED: "Vencido",
  CANCELLED: "Anulado",
};

const statusOptions: ComplaintBookStatus[] = [
  "REGISTERED",
  "UNDER_REVIEW",
  "ANSWERED",
  "CLOSED",
  "EXPIRED",
  "CANCELLED",
];

const initialForm: CreateComplaintBookEntryPayload = {
  claimantType: "NATURAL",
  claimantName: "",
  claimantDocumentType: "DNI",
  claimantDocumentNumber: "",
  claimantAddress: "",
  claimantPhone: "",
  claimantEmail: "",

  isMinor: false,

  goodType: "SERVICE",
  claimedAmount: undefined,
  goodDescription: "",

  serviceOrderCode: "",
  vehiclePlate: "",
  vehicleBrand: "",
  vehicleModel: "",
  serviceDate: "",
  paymentDocument: "",

  caseType: "CLAIM",
  detail: "",
  customerRequest: "",
  responseMethod: "EMAIL",

  acceptedDeclaration: true,
};

export default function ComplaintBookPage() {
  const [items, setItems] = useState<ComplaintBookEntry[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ComplaintBookStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<CreateComplaintBookEntryPayload>(initialForm);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getComplaintBookEntries({
        search,
        status,
        page: 1,
        limit: 20,
      });

      setItems(data.items);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las reclamaciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const data = await getComplaintBookEntries({
          page: 1,
          limit: 20,
        });

        if (mounted) {
          setItems(data.items);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          alert("No se pudieron cargar las reclamaciones");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(
    field: keyof CreateComplaintBookEntryPayload,
    value: string | boolean | number | undefined,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);

      const payload: CreateComplaintBookEntryPayload = {
        ...form,
        claimedAmount:
          form.claimedAmount === undefined || form.claimedAmount === null
            ? undefined
            : Number(form.claimedAmount),
        serviceDate: form.serviceDate || undefined,
        claimantEmail: form.claimantEmail || undefined,
        claimantPhone: form.claimantPhone || undefined,
        claimantAddress: form.claimantAddress || undefined,
        serviceOrderCode: form.serviceOrderCode || undefined,
        vehiclePlate: form.vehiclePlate || undefined,
        vehicleBrand: form.vehicleBrand || undefined,
        vehicleModel: form.vehicleModel || undefined,
        paymentDocument: form.paymentDocument || undefined,
      };

      await createComplaintBookEntry(payload);

      setForm(initialForm);
      await loadData();

      alert("Reclamación registrada correctamente");
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la reclamación");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: ComplaintBookStatus,
  ) {
    try {
      await updateComplaintStatus(id, newStatus);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el estado");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      <section className="mb-6">
        <p className="text-sm text-neutral-500">Atención al cliente</p>
        <h1 className="text-2xl font-bold text-neutral-900">
          Libro de Reclamaciones
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Registra y gestiona reclamos o quejas relacionados con servicios,
          repuestos, pagos y atención del taller.
        </p>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard title="Total" value={items.length} />
        <SummaryCard
          title="Registrados"
          value={items.filter((item) => item.status === "REGISTERED").length}
        />
        <SummaryCard
          title="En revisión"
          value={items.filter((item) => item.status === "UNDER_REVIEW").length}
        />
        <SummaryCard
          title="Respondidos"
          value={items.filter((item) => item.status === "ANSWERED").length}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-1 text-lg font-semibold text-neutral-900">
            Nueva reclamación
          </h2>
          <p className="mb-5 text-sm text-neutral-500">
            Completa los datos siguiendo la estructura del Libro de
            Reclamaciones.
          </p>

          <FormBlock title="1. Identificación del consumidor reclamante">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tipo de cliente">
                <select
                  className="input"
                  value={form.claimantType}
                  onChange={(e) => handleChange("claimantType", e.target.value)}
                >
                  <option value="NATURAL">Persona natural</option>
                  <option value="COMPANY">Empresa</option>
                </select>
              </Field>

              <Field label="Nombre completo / Razón social">
                <input
                  className="input"
                  value={form.claimantName}
                  onChange={(e) => handleChange("claimantName", e.target.value)}
                  required
                />
              </Field>

              <Field label="Tipo de documento">
                <select
                  className="input"
                  value={form.claimantDocumentType}
                  onChange={(e) =>
                    handleChange("claimantDocumentType", e.target.value)
                  }
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">Carnet de extranjería</option>
                  <option value="RUC">RUC</option>
                  <option value="PASSPORT">Pasaporte</option>
                  <option value="OTHER">Otro</option>
                </select>
              </Field>

              <Field label="Número de documento">
                <input
                  className="input"
                  value={form.claimantDocumentNumber}
                  onChange={(e) =>
                    handleChange("claimantDocumentNumber", e.target.value)
                  }
                  required
                />
              </Field>

              <Field label="Teléfono">
                <input
                  className="input"
                  value={form.claimantPhone}
                  onChange={(e) =>
                    handleChange("claimantPhone", e.target.value)
                  }
                />
              </Field>

              <Field label="Correo">
                <input
                  className="input"
                  type="email"
                  value={form.claimantEmail}
                  onChange={(e) =>
                    handleChange("claimantEmail", e.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Domicilio">
              <input
                className="input"
                value={form.claimantAddress}
                onChange={(e) =>
                  handleChange("claimantAddress", e.target.value)
                }
              />
            </Field>
          </FormBlock>

          <FormBlock title="2. Identificación del bien contratado">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tipo de bien">
                <select
                  className="input"
                  value={form.goodType}
                  onChange={(e) => handleChange("goodType", e.target.value)}
                >
                  <option value="SERVICE">Servicio</option>
                  <option value="PART">Repuesto</option>
                  <option value="PRODUCT">Producto</option>
                  <option value="OTHER">Otro</option>
                </select>
              </Field>

              <Field label="Monto reclamado">
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={form.claimedAmount ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "claimedAmount",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </Field>

              <Field label="Orden de servicio">
                <input
                  className="input"
                  value={form.serviceOrderCode}
                  onChange={(e) =>
                    handleChange("serviceOrderCode", e.target.value)
                  }
                />
              </Field>

              <Field label="Placa">
                <input
                  className="input"
                  value={form.vehiclePlate}
                  onChange={(e) =>
                    handleChange("vehiclePlate", e.target.value.toUpperCase())
                  }
                />
              </Field>

              <Field label="Marca">
                <input
                  className="input"
                  value={form.vehicleBrand}
                  onChange={(e) => handleChange("vehicleBrand", e.target.value)}
                />
              </Field>

              <Field label="Modelo">
                <input
                  className="input"
                  value={form.vehicleModel}
                  onChange={(e) => handleChange("vehicleModel", e.target.value)}
                />
              </Field>

              <Field label="Fecha del servicio">
                <input
                  className="input"
                  type="date"
                  value={form.serviceDate}
                  onChange={(e) => handleChange("serviceDate", e.target.value)}
                />
              </Field>

              <Field label="Comprobante">
                <input
                  className="input"
                  value={form.paymentDocument}
                  onChange={(e) =>
                    handleChange("paymentDocument", e.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Descripción del servicio, producto o repuesto">
              <textarea
                className="input min-h-24"
                value={form.goodDescription}
                onChange={(e) =>
                  handleChange("goodDescription", e.target.value)
                }
                required
              />
            </Field>
          </FormBlock>

          <FormBlock title="3. Detalle de la reclamación">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tipo">
                <select
                  className="input"
                  value={form.caseType}
                  onChange={(e) => handleChange("caseType", e.target.value)}
                >
                  <option value="CLAIM">Reclamo</option>
                  <option value="COMPLAINT">Queja</option>
                </select>
              </Field>

              <Field label="Medio de respuesta">
                <select
                  className="input"
                  value={form.responseMethod}
                  onChange={(e) =>
                    handleChange("responseMethod", e.target.value)
                  }
                >
                  <option value="EMAIL">Correo</option>
                  <option value="PHONE">Teléfono</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="IN_PERSON">Presencial</option>
                </select>
              </Field>
            </div>

            <Field label="Detalle del reclamo o queja">
              <textarea
                className="input min-h-24"
                value={form.detail}
                onChange={(e) => handleChange("detail", e.target.value)}
                required
              />
            </Field>

            <Field label="Pedido del cliente">
              <textarea
                className="input min-h-24"
                value={form.customerRequest}
                onChange={(e) =>
                  handleChange("customerRequest", e.target.value)
                }
                required
              />
            </Field>
          </FormBlock>

          <label className="mb-5 flex items-start gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={form.acceptedDeclaration}
              onChange={(e) =>
                handleChange("acceptedDeclaration", e.target.checked)
              }
              className="mt-1"
            />
            Declaro que la información registrada es verdadera y autorizo al
            taller a contactarme para la atención del presente reclamo.
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {saving ? "Registrando..." : "Registrar reclamación"}
          </button>
        </form>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Reclamaciones registradas
              </h2>
              <p className="text-sm text-neutral-500">
                Consulta, filtra y cambia el estado.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Actualizar
            </button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              className="input md:col-span-2"
              placeholder="Buscar por código, cliente, DNI o placa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ComplaintBookStatus | "")
              }
            >
              <option value="">Todos</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {statusLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="mb-5 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Buscar
          </button>

          {loading ? (
            <p className="text-sm text-neutral-500">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
              No hay reclamaciones registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {item.code}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {item.claimantName}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Doc: {item.claimantDocumentNumber}
                      </p>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      {item.caseType === "CLAIM" ? "Reclamo" : "Queja"}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-neutral-600 md:grid-cols-2">
                    <p>
                      <span className="font-medium">Bien:</span> {item.goodType}
                    </p>
                    <p>
                      <span className="font-medium">Placa:</span>{" "}
                      {item.vehiclePlate || "No registrada"}
                    </p>
                    <p>
                      <span className="font-medium">Registro:</span>{" "}
                      {formatDate(item.registeredAt)}
                    </p>
                    <p>
                      <span className="font-medium">Límite:</span>{" "}
                      {item.dueDate ? formatDate(item.dueDate) : "No definido"}
                    </p>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm text-neutral-500">
                    {item.detail}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Estado:</span>
                    <select
                      className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none"
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(
                          item.id,
                          e.target.value as ComplaintBookStatus,
                        )
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {statusLabels[option]}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}

function FormBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-neutral-200 p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-700">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
