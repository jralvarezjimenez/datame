import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// --- Consultations (SOAP Format - Ley 576/2000 Colombia) ---
export interface VitalSigns {
  weight?: number;           // kg
  temperature?: number;      // °C
  heartRate?: number;        // lpm
  respiratoryRate?: number;  // rpm
  mucousMembranes?: string;  // rosadas, pálidas, cianóticas, ictéricas
  capillaryRefillTime?: number; // segundos
  bodyCondition?: number;    // 1-9 scale
  hydration?: string;        // normal, leve, moderada, severa
}

export interface Consultation {
  id: string;
  patientId: string;
  vetId: string;
  vetName: string;
  date: string;
  reason: string;

  // SOAP Fields
  subjective: string;     // S: History from owner - symptoms, duration, behavior changes
  objective: string;      // O: Physical exam findings, vital signs, lab results
  assessment: string;     // A: Diagnosis / differential diagnoses
  plan: string;           // P: Treatment plan, medications, follow-up

  vitals?: VitalSigns;

  // Legacy compatibility
  diagnosis: string;      // Maps to Assessment
  treatment: string;      // Maps to Plan
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
  const q = query(collection(db, 'consultations'), where('patientId', '==', patientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Consultation).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
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
  const q = query(collection(db, 'vaccinations'), where('patientId', '==', patientId));
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
  const q = query(collection(db, 'prescriptions'), where('patientId', '==', patientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Prescription);
}
