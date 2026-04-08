import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  species: string;
  ownerId: string;
  ownerName: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  reason: string;
  vetName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Timestamp;
}

export type AppointmentInput = Omit<Appointment, 'id' | 'createdAt'>;

const appointmentsRef = collection(db, 'appointments');

export async function createAppointment(data: AppointmentInput): Promise<string> {
  const ref = await addDoc(appointmentsRef, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const q = query(appointmentsRef, where('date', '==', date));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment).sort((a, b) => a.time.localeCompare(b.time));
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const snap = await getDocs(appointmentsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment).sort((a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time));
}

export async function getAppointmentsByOwner(ownerId: string): Promise<Appointment[]> {
  const q = query(appointmentsRef, where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Appointment).sort((a, b) => b.date.localeCompare(a.date));
}

export async function updateAppointment(id: string, data: Partial<AppointmentInput>): Promise<void> {
  await updateDoc(doc(db, 'appointments', id), data);
}

export async function deleteAppointment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'appointments', id));
}
