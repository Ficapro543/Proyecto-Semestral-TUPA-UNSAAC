/**
 * Traducción de los estados de `solicitud.estado` (BD) a etiqueta legible y
 * clase de badge del design system. Centralizado aquí para que el panel del
 * estudiante y el del admin muestren exactamente lo mismo.
 */
export const ESTADOS = {
  BORRADOR: { label: 'Borrador', badge: 'badge-neutral', icon: 'draft' },
  SOLICITADO: { label: 'Solicitado', badge: 'badge-blue', icon: 'inbox' },
  VERIFICANDO_PAGO: { label: 'Verificando pago', badge: 'badge-warning', icon: 'payments' },
  PAGADO: { label: 'Pagado', badge: 'badge-blue', icon: 'paid' },
  'EN PROCESO': { label: 'En proceso', badge: 'badge-in-review', icon: 'fact_check' },
  SUBSANACION: { label: 'En subsanación', badge: 'badge-warning', icon: 'edit_note' },
  OBSERVADO: { label: 'Observado', badge: 'badge-error', icon: 'report_problem' },
  COMPLETADO: { label: 'Completado', badge: 'badge-success', icon: 'check_circle' },
  ANULADO: { label: 'Anulado', badge: 'badge-neutral', icon: 'block' },
  RECHAZADO: { label: 'Rechazado', badge: 'badge-error', icon: 'cancel' },
};

export function estadoInfo(estado) {
  return ESTADOS[estado] || { label: estado || '—', badge: 'badge-neutral', icon: 'help' };
}

/** Estados que el admin considera "en cola" (pendientes de acción). */
export const ESTADOS_PENDIENTES = [
  'SOLICITADO',
  'VERIFICANDO_PAGO',
  'PAGADO',
  'EN PROCESO',
  'SUBSANACION',
];

/** Estados que ya no admiten decisión administrativa. */
export const ESTADOS_CERRADOS = ['COMPLETADO', 'RECHAZADO', 'ANULADO'];

export function esCerrado(estado) {
  return ESTADOS_CERRADOS.includes(estado);
}

export function formatFecha(value, { conHora = false } = {}) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const fecha = d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  if (!conHora) return fecha;
  return `${fecha} · ${d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatSoles(monto) {
  const n = Number(monto);
  if (Number.isNaN(n)) return '—';
  if (n === 0) return 'Gratuito';
  return `S/. ${n.toFixed(2)}`;
}

export function nombreCompleto(u) {
  if (!u) return '—';
  return [u.nombres, u.ap_paterno, u.ap_materno].filter(Boolean).join(' ');
}
