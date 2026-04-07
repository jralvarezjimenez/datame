import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// --- Consultations ---
export interface Consultation {
  id: string;
  patientId: string;
  vetId: string;
  vetName: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  createdAt?: Timestamp;
}

export type ConsultationInput = Omit<Consultation, 'id' | 'createdAt'>;

export async function addConsultation(data: ConsultationInput): Promise<string> {
  const ref = await addDoc(collection(db, 'consultations'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getConsultations(patientId: string): Promise<Consultation[]> {
  const q = query(
    collection(db, 'consultations'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Consultation);
}

// --- Vaccinations ---
export interface Vaccination {
  id: string;
  patientId: string;
  vaccine: string;
  dateAdministered: string;
  nextDueDate: string;
  vetName: string;
  batch?: string;
  status: 'valid' | 'due_soon' | 'overdue';
  createdAt?: Timestamp;
}

export type VaccinationInput = Omit<Vaccination, 'id' | 'createdAt'>;

export async function addVaccination(data: VaccinationInput): Promise<string> {
  const ref = await addDoc(collection(db, 'vaccinations'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getVaccinations(patientId: string): Promise<Vaccination[]> {
  const q = query(
    collection(db, 'vaccinations'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Vaccination);
}

// --- Prescriptions ---
export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  vetName: string;
  status: 'active' | 'completed';
  notes?: string;
  createdAt?: Timestamp;
}

export type PrescriptionInput = Omit<Prescription, 'id' | 'createdAt'>;

export async function addPrescription(data: PrescriptionInput): Promise<string> {
  const ref = await addDoc(collection(db, 'prescriptions'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPrescriptions(patientId: string): Promise<Prescription[]> {
  const q = query(
    collection(db, 'prescriptions'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Prescription);
}
