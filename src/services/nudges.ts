/**
 * Behavioral Science Nudges for Treatment Adherence
 * Based on: defaults, social proof, framing, gamification
 * Reference: Market research - non-adherence >50% in vet medicine
 */

import type { Patient } from './patients';
import type { Appointment } from './appointments';
import type { Vaccination } from './clinical';

export interface Nudge {
  id: string;
  type: 'social_proof' | 'framing' | 'urgency' | 'reward' | 'default';
  title: string;
  message: string;
  action?: string;
  actionLink?: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateNudges(
  patients: Patient[],
  appointments: Appointment[],
  vaccinations: Vaccination[],
): Nudge[] {
  const nudges: Nudge[] = [];
  const today = new Date().toISOString().split('T')[0];

  // --- Social Proof ---
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'active').length;
  if (totalPatients > 0) {
    const pct = Math.round((activePatients / totalPatients) * 100);
    if (pct >= 70) {
      nudges.push({
        id: 'social-active',
        type: 'social_proof',
        title: 'Tu clínica está activa',
        message: `${pct}% de tus pacientes están activos. Las clínicas con >80% de pacientes activos retienen 3x más clientes.`,
        priority: 'low',
      });
    }
  }

  // --- Vaccination Social Proof ---
  const overdueVax = vaccinations.filter((v) => v.status === 'overdue');
  const validVax = vaccinations.filter((v) => v.status === 'valid');
  if (overdueVax.length > 0 && validVax.length > 0) {
    const totalVax = vaccinations.length;
    const upToDatePct = Math.round((validVax.length / totalVax) * 100);
    nudges.push({
      id: 'social-vax',
      type: 'social_proof',
      title: 'Vacunación al día',
      message: `${upToDatePct}% de tus pacientes tienen vacunas vigentes. ${overdueVax.length} paciente${overdueVax.length > 1 ? 's' : ''} necesita${overdueVax.length > 1 ? 'n' : ''} atención.`,
      action: 'Ver pendientes',
      actionLink: '/alerts',
      priority: 'high',
    });
  }

  // --- Framing: Daily cost ---
  if (totalPatients >= 5) {
    nudges.push({
      id: 'framing-value',
      type: 'framing',
      title: 'Valor por paciente',
      message: `Gestionar ${totalPatients} pacientes con DATA ME cuesta menos que un café al día. Imagina el costo sin sistema: expedientes perdidos, citas olvidadas, vacunas vencidas.`,
      priority: 'low',
    });
  }

  // --- Urgency: Appointments today ---
  const todayAppts = appointments.filter((a) => a.date === today && a.status === 'scheduled');
  if (todayAppts.length > 0) {
    nudges.push({
      id: 'urgency-today',
      type: 'urgency',
      title: `${todayAppts.length} cita${todayAppts.length > 1 ? 's' : ''} hoy`,
      message: `Tienes ${todayAppts.length} cita${todayAppts.length > 1 ? 's' : ''} programada${todayAppts.length > 1 ? 's' : ''}. La próxima: ${todayAppts[0].patientName} a las ${todayAppts[0].time}.`,
      action: 'Ver agenda',
      actionLink: '/agenda',
      priority: 'high',
    });
  }

  // --- Urgency: No appointments scheduled ---
  const futureAppts = appointments.filter((a) => a.date >= today && a.status === 'scheduled');
  if (futureAppts.length === 0 && totalPatients > 0) {
    nudges.push({
      id: 'urgency-no-appts',
      type: 'urgency',
      title: 'Sin citas programadas',
      message: 'Las clínicas que usan agenda digital reducen cancelaciones en 40%. Programa la siguiente cita de tus pacientes.',
      action: 'Abrir agenda',
      actionLink: '/agenda',
      priority: 'medium',
    });
  }

  // --- Default: Auto-schedule suggestion ---
  const recentAppts = appointments.filter((a) => a.status === 'completed').slice(0, 5);
  recentAppts.forEach((appt) => {
    const hasFollowUp = appointments.some(
      (a) => a.patientId === appt.patientId && a.status === 'scheduled' && a.date > today
    );
    if (!hasFollowUp) {
      nudges.push({
        id: `default-followup-${appt.patientId}`,
        type: 'default',
        title: `Seguimiento: ${appt.patientName}`,
        message: `La última cita de ${appt.patientName} fue completada. ¿Programar cita de control?`,
        action: 'Programar',
        actionLink: '/agenda',
        priority: 'medium',
      });
    }
  });

  // --- Reward: Milestones ---
  if (totalPatients === 1) {
    nudges.push({ id: 'reward-first', type: 'reward', title: '¡Primer paciente!', message: 'Registraste tu primer paciente en DATA ME. El siguiente paso: registrar su primera consulta SOAP.', priority: 'low' });
  } else if (totalPatients === 10) {
    nudges.push({ id: 'reward-10', type: 'reward', title: '¡10 pacientes!', message: 'Tu clínica ya gestiona 10 pacientes digitalmente. Estás en camino a una gestión 100% digital.', priority: 'low' });
  } else if (totalPatients === 50) {
    nudges.push({ id: 'reward-50', type: 'reward', title: '¡50 pacientes!', message: 'Tu clínica es referente en gestión digital. Considera invitar a colegas a DATA ME.', priority: 'low' });
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return nudges.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
