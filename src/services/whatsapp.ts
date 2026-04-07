import type { Appointment } from './appointments';

/**
 * Generate WhatsApp deep link with pre-filled message.
 * Uses wa.me API - free, no backend needed, opens WhatsApp directly.
 *
 * For automated bulk messaging, upgrade to Twilio/WhatsApp Business API.
 */

export function generateAppointmentReminder(appointment: Appointment, clinicName = 'DATA ME'): string {
  const message = [
    `Hola ${appointment.ownerName},`,
    ``,
    `Le recordamos su cita en ${clinicName}:`,
    ``,
    `Paciente: ${appointment.patientName} (${appointment.species})`,
    `Fecha: ${formatDate(appointment.date)}`,
    `Hora: ${appointment.time}`,
    `Motivo: ${appointment.reason}`,
    ``,
    `Por favor confirme su asistencia respondiendo a este mensaje.`,
    ``,
    `— ${clinicName}`,
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function generateVaccineReminder(
  ownerName: string,
  petName: string,
  vaccine: string,
  dueDate: string,
  clinicName = 'DATA ME',
): string {
  const message = [
    `Hola ${ownerName},`,
    ``,
    `Le informamos que la vacuna de ${petName} está próxima a vencer:`,
    ``,
    `Vacuna: ${vaccine}`,
    `Fecha límite: ${formatDate(dueDate)}`,
    ``,
    `Le recomendamos agendar una cita lo antes posible.`,
    ``,
    `— ${clinicName}`,
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function generateFollowUpReminder(
  ownerName: string,
  petName: string,
  reason: string,
  clinicName = 'DATA ME',
): string {
  const message = [
    `Hola ${ownerName},`,
    ``,
    `¿Cómo sigue ${petName}? Queremos saber cómo va su recuperación.`,
    ``,
    `Última visita: ${reason}`,
    ``,
    `Si tiene alguna duda o necesita una cita de seguimiento, no dude en contactarnos.`,
    ``,
    `— ${clinicName}`,
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
